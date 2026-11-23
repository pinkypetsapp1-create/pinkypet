#!/usr/bin/env node
// Genera app/src/theme/tokens.css a partir de design/design-system/tokens.json.
// Es la única fuente de color, tipografía, forma, espaciado, elevación, opacidad y tamaño del código.
// (El movimiento —curvas y duraciones— vive en bundle.css, también del Design System.)
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
export const SOURCE = join(ROOT, 'design/design-system/tokens.json');
export const OUTPUT = join(ROOT, 'app/src/theme/tokens.css');

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

if (import.meta.url === `file://${process.argv[1]}`) {
  const css = generate(readFileSync(SOURCE, 'utf8'));
  mkdirSync(dirname(OUTPUT), { recursive: true });
  writeFileSync(OUTPUT, css);
  console.log(`Escrito ${OUTPUT.replace(ROOT, '')} (${css.split('\n').length} líneas).`);
}
