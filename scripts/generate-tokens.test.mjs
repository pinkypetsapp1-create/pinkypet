import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { generate, generateBundle, SOURCE, OUTPUT, BUNDLE_SOURCE, BUNDLE_OUTPUT, ASSET_COPIES } from './generate-tokens.mjs';
import { readdirSync } from 'node:fs';

const ROOT = new URL('..', import.meta.url).pathname;
const source = readFileSync(SOURCE, 'utf8');
const css = generate(source);
const bundle = readFileSync(join(ROOT, 'design/design-system/components/bundle.css'), 'utf8');

const block = (selector) => {
  const start = css.indexOf(`${selector} {`);
  assert.ok(start >= 0, `falta el bloque ${selector}`);
  return css.slice(start, css.indexOf('}', start));
};

test('lleva la cabecera de archivo generado', () => {
  assert.match(css, /^\/\* ARCHIVO GENERADO · NO EDITAR/);
});

test('la salida es determinista', () => {
  assert.equal(generate(source), css);
});

test('el archivo del repositorio está al día (npm run tokens)', () => {
  assert.equal(readFileSync(OUTPUT, 'utf8'), css);
});

test('primary claro es #734863, no la semilla #8E607C', () => {
  assert.match(block(':root'), /--primary: #734863;/);
  assert.doesNotMatch(css, /#8E607C/i);
});

test('el oscuro usa el selector de bundle.css', () => {
  assert.match(block('[data-theme="dark"]'), /--primary: #EEB7D6;/);
});

test('cada tema define todos los roles de color', () => {
  const t = JSON.parse(source);
  const roles = t.color.tokens.filter((c) => typeof c.value === 'object').map((c) => c.name);
  for (const sel of [':root', '[data-theme="dark"]', '.pp-contrast-medium', '.pp-contrast-high']) {
    const b = block(sel);
    for (const r of roles) assert.match(b, new RegExp(`--${r}: #`), `${sel} sin --${r}`);
  }
});

test('toda variable que usa bundle.css existe en tokens.css o en el propio bundle.css', () => {
  const used = new Set([...bundle.matchAll(/var\(--([a-z0-9-]+)/g)].map((m) => m[1]));
  const definedInBundle = new Set([...bundle.matchAll(/--([a-z0-9-]+)\s*:/g)].map((m) => m[1]));
  // Variables locales que los componentes reciben por style="" (posición, giro, valor del medidor…).
  const local = new Set(['i', 'r', 'x', 'y', 'pp-value']);
  const missing = [...used].filter((v) => !definedInBundle.has(v) && !local.has(v) && !css.includes(`--${v}:`));
  assert.deepEqual(missing, []);
});

test('ds-bundle.css es bundle.css sin el @import de Google Fonts y está al día', () => {
  const out = generateBundle(readFileSync(BUNDLE_SOURCE, 'utf8'));
  assert.doesNotMatch(out, /fonts\.googleapis\.com/);
  assert.match(out, /^\/\* ARCHIVO GENERADO · NO EDITAR/);
  assert.ok(out.includes('.pp-btn {'));
  assert.equal(readFileSync(BUNDLE_OUTPUT, 'utf8'), out);
});

test('las imágenes de la app son copias exactas de las del Design System', () => {
  for (const { from, to, ext } of ASSET_COPIES) {
    const files = readdirSync(from).filter((f) => f.endsWith(ext));
    assert.ok(files.length > 0);
    assert.deepEqual(readdirSync(to).filter((f) => f.endsWith(ext)).sort(), files.sort());
    for (const f of files) assert.ok(readFileSync(join(from, f)).equals(readFileSync(join(to, f))), f);
  }
});
