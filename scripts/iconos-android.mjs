// npm run iconos · Icono de la app Android y pantalla de arranque a partir del isotipo del Design System
// (design/design-system/assets/Logotipo/isotipo.svg; Logo/README: «Icono de la app»). Necesita Playwright.
import { chromium } from 'playwright';
import { readFileSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const RES = 'app/android/app/src/main/res';
const SVG = readFileSync('design/design-system/assets/Logotipo/isotipo.svg', 'utf8');
const paw = SVG.match(/<g transform="translate\(13 13\) scale\(0\.72\)" fill="#FFFFFF">([\s\S]*?)<\/g>/)[1];
const isotipo = (size) => SVG.replace('<svg ', `<svg width="${size}" height="${size}" `);
// Icono adaptable: lienzo de 108 dp con la zona segura de 66 dp en el centro, donde cabe el círculo del isotipo.
// El fondo malva (#734863, primary) está en values/ic_launcher_background.xml.
const foreground = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 108 108"><g transform="translate(21 21) scale(0.66)"><g transform="translate(13 13) scale(0.72)" fill="#FFFFFF">${paw}</g></g></svg>`;
const size = (file) => execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file], { encoding: 'utf8' }).match(/\d+/g).slice(-2).map(Number);
const b = await chromium.launch();
const p = await b.newPage({ deviceScaleFactor: 1 });
const render = async (html, w, h, out, bg = 'transparent') => {
  await p.setViewportSize({ width: w, height: h });
  await p.setContent(`<html><body style="margin:0;width:${w}px;height:${h}px;background:${bg};display:flex;align-items:center;justify-content:center">${html}</body></html>`);
  await p.screenshot({ path: out, omitBackground: bg === 'transparent' });
};
for (const [d, s] of [['mdpi', 48], ['hdpi', 72], ['xhdpi', 96], ['xxhdpi', 144], ['xxxhdpi', 192]]) {
  await render(isotipo(s), s, s, `${RES}/mipmap-${d}/ic_launcher.png`);
  await render(isotipo(s), s, s, `${RES}/mipmap-${d}/ic_launcher_round.png`);
  await render(foreground(s * 2.25), s * 2.25, s * 2.25, `${RES}/mipmap-${d}/ic_launcher_foreground.png`);
}
// Pantalla de arranque (Android 11 o anterior): isotipo al 30 % sobre surface (#FDF8F7).
for (const dir of readdirSync(RES).filter((n) => n.startsWith('drawable'))) {
  const file = `${RES}/${dir}/splash.png`;
  try { const [w, h] = size(file); await render(isotipo(Math.round(Math.min(w, h) * 0.3)), w, h, file, '#FDF8F7'); } catch { /* sin splash en esa carpeta */ }
}
await b.close();
console.log('Icono y pantallas de arranque generados desde el isotipo del Design System.');
