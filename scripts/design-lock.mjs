#!/usr/bin/env node
// Genera design/design.lock.json a partir de la copia local de design/ y la verifica
// contra el manifiesto remoto (los sha256 que da el listado de cada artifact).
//
// Uso:
//   node scripts/design-lock.mjs --remote <manifiesto.txt>   verifica y escribe el lock
//   node scripts/design-lock.mjs --check                     solo comprueba que design/ coincide con el lock
//
// Formato del manifiesto (una entrada por línea; los sha pueden ir abreviados):
//   ds <versión>                         af <versión>
//   ds project/<ruta> <sha256>           af project/<ruta> <sha256>
//   dsasset <id del blob> <sha256>
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const DESIGN = join(ROOT, 'design');
const DS_DIR = join(DESIGN, 'design-system');
const AF_DIR = join(DESIGN, 'alta-fidelidad');
const REF_DIR = join(DESIGN, 'reference');
const LOCK = join(DESIGN, 'design.lock.json');
const URLS = {
  ds: 'https://claude.ai/artifact/FdYKiHu4B9TE7YT6tG8ErF',
  af: 'https://claude.ai/artifact/1MwUAQpwJFExpLby6g9vH2',
};

const sha256 = (file) => createHash('sha256').update(readFileSync(file)).digest('hex');
const posix = (p) => p.split(sep).join('/');

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).sort().flatMap((name) => {
    const full = join(dir, name);
    if (name === '.DS_Store') return [];
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

function hashTree(dir) {
  const out = {};
  for (const f of walk(dir)) out[posix(relative(dir, f))] = sha256(f);
  return out;
}

function parseManifest(file) {
  const m = { versions: {}, ds: {}, af: {}, dsasset: {} };
  for (const raw of readFileSync(file, 'utf8').split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const parts = line.split(/\s+/);
    if (parts.length === 2) m.versions[parts[0]] = parts[1];
    else if (parts.length === 3 && m[parts[0]]) m[parts[0]][parts[1]] = parts[2].toLowerCase();
    else throw new Error(`Línea del manifiesto no válida: «${line}»`);
  }
  return m;
}

// Assets binarios del DS: la ruta local sale del índice design-system.json (grupo/nombre → blob).
function assetIndex() {
  const idx = JSON.parse(readFileSync(join(DS_DIR, 'design-system.json'), 'utf8'));
  const map = {};
  for (const [group, g] of Object.entries(idx.assetGroups ?? {})) {
    for (const [name, rec] of Object.entries(g.files ?? {})) map[`assets/${group}/${name}`] = rec.blob;
  }
  return map;
}

function buildLock(remote) {
  const errors = [];
  const match = (local, expected, label) => {
    if (!expected) errors.push(`${label}: no está en el listado remoto`);
    else if (!local.startsWith(expected)) errors.push(`${label}: sha local ${local.slice(0, 16)}… ≠ remoto ${expected}`);
  };

  // Design System
  const dsFiles = hashTree(DS_DIR);
  const blobs = assetIndex();
  const dsLock = { files: {}, assets: {} };
  for (const [path, sha] of Object.entries(dsFiles)) {
    if (blobs[path]) {
      dsLock.assets[path] = { sha256: sha, blob: blobs[path] };
      if (remote) match(sha, remote.dsasset[blobs[path]], `DS ${path}`);
    } else {
      dsLock.files[path] = sha;
      if (remote) match(sha, remote.ds[`project/${path}`], `DS ${path}`);
    }
  }
  if (remote) {
    for (const p of Object.keys(remote.ds)) {
      if (!(p.replace(/^project\//, '') in dsFiles)) errors.push(`DS ${p}: falta en design/`);
    }
    const local = new Set(Object.values(blobs));
    for (const id of Object.keys(remote.dsasset)) if (!local.has(id)) errors.push(`DS asset ${id}: falta en design/`);
  }

  // Alta fidelidad (sin su copia embebida del DS, que solo se usa para la coherencia)
  const afFiles = hashTree(AF_DIR);
  if (remote) {
    for (const [path, sha] of Object.entries(afFiles)) match(sha, remote.af[`project/${path}`], `AF ${path}`);
    for (const p of Object.keys(remote.af)) {
      if (p.startsWith('project/ds/')) continue;
      if (!(p.replace(/^project\//, '') in afFiles)) errors.push(`AF ${p}: falta en design/`);
    }
  }

  // Coherencia (apartado 2.3): la copia del DS dentro de AF debe ser idéntica al DS.
  const canvas = JSON.parse(readFileSync(join(AF_DIR, 'canvas.json'), 'utf8'));
  const rec = (canvas.designSystems ?? [])[0] ?? {};
  const embedded = remote
    ? {
        tokens: remote.af['project/ds/pinkypet/tokens.json'] ?? null,
        bundle: remote.af['project/ds/pinkypet/components/bundle.css'] ?? null,
      }
    : null;
  const coherence = {
    recordedVersion: rec.version ?? null,
    copiedAt: rec.copiedAt ?? null,
    tokensJson: embedded ? Boolean(embedded.tokens && dsFiles['tokens.json'].startsWith(embedded.tokens)) : null,
    bundleCss: embedded ? Boolean(embedded.bundle && dsFiles['components/bundle.css'].startsWith(embedded.bundle)) : null,
  };
  if (remote && !(coherence.tokensJson && coherence.bundleCss)) {
    errors.push('COHERENCIA: tokens.json o bundle.css de Alta fidelidad no coinciden con el Design System. Hay que alinearlos en Claude Design.');
  }

  return { errors, dsLock, afFiles, coherence };
}

const args = process.argv.slice(2);
const remoteArg = args.indexOf('--remote');

if (args.includes('--check')) {
  if (!existsSync(LOCK)) { console.error('No hay design.lock.json.'); process.exit(1); }
  const lock = JSON.parse(readFileSync(LOCK, 'utf8'));
  const { dsLock, afFiles } = buildLock(null);
  const diff = [];
  const cmp = (a, b, label) => {
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) if (a[k] !== b[k]) diff.push(`${label}${k}`);
  };
  cmp(Object.fromEntries(Object.entries(dsLock.assets).map(([k, v]) => [k, v.sha256])),
      Object.fromEntries(Object.entries(lock.designSystem.assets).map(([k, v]) => [k, v.sha256])), 'DS ');
  cmp(dsLock.files, lock.designSystem.files, 'DS ');
  cmp(afFiles, lock.altaFidelidad.files, 'AF ');
  cmp(hashTree(REF_DIR), lock.reference.files, 'reference ');
  if (diff.length) { console.error('design/ no coincide con el lock:\n  ' + diff.join('\n  ')); process.exit(1); }
  console.log('design/ coincide con design.lock.json.');
  process.exit(0);
}

if (remoteArg === -1) {
  console.error('Uso: node scripts/design-lock.mjs --remote <manifiesto> | --check');
  process.exit(2);
}

const remote = parseManifest(args[remoteArg + 1]);
const { errors, dsLock, afFiles, coherence } = buildLock(remote);
const now = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');

const lock = {
  comment: 'Generado por scripts/design-lock.mjs. No editar a mano.',
  designSystem: { url: URLS.ds, version: remote.versions.ds, syncedAt: now, ...dsLock },
  altaFidelidad: { url: URLS.af, version: remote.versions.af, syncedAt: now, coherence, files: afFiles },
  reference: { note: 'Capturas 412×917 exportadas desde Alta fidelidad', files: hashTree(REF_DIR) },
};

const nDs = Object.keys(dsLock.files).length + Object.keys(dsLock.assets).length;
console.log(`Design System ${remote.versions.ds}: ${Object.keys(dsLock.files).length} archivos + ${Object.keys(dsLock.assets).length} assets`);
console.log(`Alta fidelidad ${remote.versions.af}: ${Object.keys(afFiles).length} archivos`);
console.log(`Coherencia: tokens.json ${coherence.tokensJson ? 'OK' : 'NO'} · bundle.css ${coherence.bundleCss ? 'OK' : 'NO'}`);

if (errors.length) {
  console.error(`\n${errors.length} discrepancias:\n  ` + errors.join('\n  '));
  console.error('No se escribe el lock.');
  process.exit(1);
}
writeFileSync(LOCK, JSON.stringify(lock, null, 2) + '\n');
console.log(`0 discrepancias. Escrito design/design.lock.json (${nDs + Object.keys(afFiles).length} archivos).`);
