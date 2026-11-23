#!/usr/bin/env node
// Genera app/src/theme/tokens.css a partir de design/design-system/tokens.json.
// Es la única fuente de color, tipografía, forma, espaciado, elevación, opacidad y tamaño del código.
// (El movimiento —curvas y duraciones— vive en bundle.css, también del Design System.)
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, readdirSync, copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
export const SOURCE = join(ROOT, 'design/design-system/tokens.json');
export const OUTPUT = join(ROOT, 'app/src/theme/tokens.css');
export const BUNDLE_SOURCE = join(ROOT, 'design/design-system/components/bundle.css');
export const BUNDLE_OUTPUT = join(ROOT, 'app/src/theme/ds-bundle.css');
// Imágenes del Design System que la app empaqueta (Angular no sirve archivos de fuera de app/).
export const ASSET_COPIES = [
  { from: join(ROOT, 'design/design-system/assets/Fotos'), to: join(ROOT, 'app/src/assets/fotos'), ext: '.jpg' },
  { from: join(ROOT, 'design/design-system/assets/Ilustraciones'), to: join(ROOT, 'app/src/assets/ilustraciones'), ext: '.png' },
];

// Tema del Design System → selector CSS.
// Claro en :root; oscuro con el mismo selector que usa bundle.css; contrastes como clases opcionales.
const THEME_SELECTORS = {
  light: [':root'],
  dark: ['[data-theme="dark"]'],
  'light-mc': ['.pp-contrast-medium'],
  'light-hc': ['.pp-contrast-high'],
  'dark-mc': ['[data-theme="dark"].pp-contrast-medium', '[data-theme="dark"] .pp-contrast-medium'],
  'dark-hc': ['[data-theme="dark"].pp-contrast-high', '[data-theme="dark"] .pp-contrast-high'],
};

const block = (selectors, lines) => `${selectors.join(',\n')} {\n${lines.map((l) => `  ${l}`).join('\n')}\n}\n`;

export function generate(sourceText) {
  const t = JSON.parse(sourceText);
  const themes = t.color.themes.map((th) => th.id);
  for (const id of themes) {
    if (!THEME_SELECTORS[id]) throw new Error(`Tema sin selector: ${id}`);
  }
  const first = themes[0];
  const out = [];
  const sha = createHash('sha256').update(sourceText).digest('hex');

  out.push(
    `/* ARCHIVO GENERADO · NO EDITAR\n` +
      ` * Origen: design/design-system/tokens.json (${t.name}, sha256 ${sha.slice(0, 16)}…)\n` +
      ` * Regenerar con: npm run tokens\n */\n`,
  );

  // 1. Colores por tema
  const byTheme = Object.fromEntries(themes.map((id) => [id, []]));
  const constant = [];
  for (const tok of t.color.tokens) {
    if (typeof tok.value === 'string') {
      constant.push(`--${tok.name}: ${tok.value};`);
      continue;
    }
    for (const id of themes) {
      // Un tema sin valor hereda el del primero (regla del formato del Design System).
      byTheme[id].push(`--${tok.name}: ${tok.value[id] ?? tok.value[first]};`);
    }
  }

  // 2. Resto de familias (iguales en todos los temas)
  const root = [...byTheme[first], ...constant];
  for (const [key, fam] of Object.entries(t.type.families)) root.push(`--font-${key}: ${fam};`);
  for (const group of t.type.groups) {
    for (const s of group.styles) {
      const fam = s.family ?? group.family;
      root.push(
        `--type-${s.name}-family: var(--font-${fam});`,
        `--type-${s.name}-size: ${s.fontSize};`,
        `--type-${s.name}-line: ${s.lineHeight};`,
        `--type-${s.name}-weight: ${s.fontWeight};`,
        `--type-${s.name}-tracking: ${s.letterSpacing ?? '0px'};`,
      );
    }
  }
  for (const key of Object.keys(t)) {
    if (['name', 'version', 'meta', 'color', 'type'].includes(key)) continue;
    for (const tok of t[key].tokens ?? []) root.push(`--${tok.name}: ${tok.value};`);
  }

  out.push(block(THEME_SELECTORS[first], root));
  for (const id of themes.slice(1)) out.push(block(THEME_SELECTORS[id], byTheme[id]));
  return out.join('\n');
}

// bundle.css del Design System, tal cual, salvo el @import de Google Fonts: la app lleva las fuentes
// empaquetadas y debe funcionar sin red (docs/design-feedback.md F0-1).
export function generateBundle(bundleText) {
  const sha = createHash('sha256').update(bundleText).digest('hex');
  const body = bundleText.replace(/^@import url\("https:\/\/fonts\.googleapis\.com[^\n]*\n/m, '');
  if (body === bundleText) throw new Error('bundle.css ya no empieza por el @import de Google Fonts: revisa generateBundle');
  return (
    `/* ARCHIVO GENERADO · NO EDITAR\n` +
    ` * Origen: design/design-system/components/bundle.css (sha256 ${sha.slice(0, 16)}…), sin el @import de Google Fonts\n` +
    ` * Regenerar con: npm run tokens\n */\n` +
    body
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const css = generate(readFileSync(SOURCE, 'utf8'));
  mkdirSync(dirname(OUTPUT), { recursive: true });
  writeFileSync(OUTPUT, css);
  console.log(`Escrito ${OUTPUT.replace(ROOT, '')} (${css.split('\n').length} líneas).`);
  writeFileSync(BUNDLE_OUTPUT, generateBundle(readFileSync(BUNDLE_SOURCE, 'utf8')));
  console.log(`Escrito ${BUNDLE_OUTPUT.replace(ROOT, '')}.`);
  for (const { from, to, ext } of ASSET_COPIES) {
    mkdirSync(to, { recursive: true });
    const files = readdirSync(from).filter((f) => f.endsWith(ext));
    for (const f of files) copyFileSync(join(from, f), join(to, f));
    console.log(`Copiadas ${files.length} imágenes a ${to.replace(ROOT, '')}.`);
  }
}
