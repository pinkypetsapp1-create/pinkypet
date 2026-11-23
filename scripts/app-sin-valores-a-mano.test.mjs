// Regla de oro 2: en el código de la app no hay colores, curvas ni duraciones escritos a mano.
// Todo sale de tokens.css / ds-bundle.css (generados) mediante var(--…).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SRC = new URL('../app/src', import.meta.url).pathname;
const GENERADOS = new Set(['theme/tokens.css', 'theme/ds-bundle.css']);
const files = [];
(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) { if (f !== 'assets') walk(p); continue; }
    const rel = p.slice(SRC.length + 1);
    if (/\.(css|scss|html|ts)$/.test(f) && !GENERADOS.has(rel) && !rel.endsWith('.d.ts')) files.push([rel, p]);
  }
})(SRC);

const PROHIBIDO = [
  [/#[0-9a-fA-F]{3,8}\b(?![^<]*<\/)/, 'color hexadecimal'],
  [/\b(rgba?|hsla?|oklch)\(/, 'función de color'],
  [/cubic-bezier\(/, 'curva de movimiento'],
  [/\b\d+(\.\d+)?m?s\b(?=[^;{}]*;)/, 'duración'],
];

test('app/src no tiene colores ni movimiento escritos a mano', () => {
  const fallos = [];
  for (const [rel, p] of files) {
    // En .ts solo se miran los estilos y plantillas en línea (cadenas con `{` o `<`).
    const text = readFileSync(p, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    const cssLike = rel.endsWith('.ts') ? (text.match(/(styles|template):\s*[`[][\s\S]*?[`\]]/g) ?? []).join('\n') : text;
    for (const [re, what] of PROHIBIDO) {
      const m = cssLike.match(re);
      if (m && !(what === 'color hexadecimal' && /&#/.test(m.input.slice(m.index - 2, m.index + 1)))) fallos.push(`${rel}: ${what} «${m[0]}»`);
    }
  }
  assert.deepEqual(fallos, []);
});
