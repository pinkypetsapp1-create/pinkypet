#!/usr/bin/env node
// Compone «Diseño | App» lado a lado para cada pantalla que tenga captura de referencia.
// Uso: node scripts/comparar.mjs <carpeta-referencia> <carpeta-app> <carpeta-salida>
//   Referencia: <Nombre>.png del artboard (por ejemplo, Main.png, MainOscuro.png).
//   App: <Nombre>.png en claro y <Nombre>.oscuro.png en oscuro (scripts/capturas.mjs).
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const [refDir = 'design/_incoming/reference', appDir = 'docs/evidencia/2a', outDir = join(appDir, 'comparacion')] = process.argv.slice(2);

// Artboards oscuros del diseño → captura oscura de la app con el mismo contenido.
const OSCURO = { MainOscuro: 'Main', 'Oscuro-Inicio': 'Inicio-Sesion', TestOscuro: 'Test', 'Oscuro-Test': 'Test', 'Oscuro-Test-Completado': 'Test-Completado' };

const pairs = readdirSync(refDir)
  .filter((f) => f.endsWith('.png'))
  .map((f) => f.slice(0, -4))
  .map((name) => ({ name, app: OSCURO[name] ? `${OSCURO[name]}.oscuro.png` : `${name}.png` }))
  .filter((p) => existsSync(join(appDir, p.app)));

const b64 = (file) => `data:image/png;base64,${readFileSync(file).toString('base64')}`;
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 412 * 2 + 24, height: 917 + 32 }, deviceScaleFactor: 1 });
for (const p of pairs) {
  await page.setContent(`<!doctype html><body style="margin:0;background:#888;font:600 14px system-ui;color:#fff">
    <div style="display:flex;gap:24px"><div><div style="height:32px;line-height:32px">Diseño · ${p.name}</div><img src="${b64(join(refDir, p.name + '.png'))}" width="412" height="917"></div>
    <div><div style="height:32px;line-height:32px">App · ${p.app}</div><img src="${b64(join(appDir, p.app))}" width="412" height="917"></div></div></body>`);
  await page.screenshot({ path: join(outDir, `${p.name}.png`) });
}
await browser.close();
console.log(`${pairs.length} comparaciones en ${outDir}`);
