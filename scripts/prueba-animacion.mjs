// Prueba de la animación de entrada: sale cada vez que se abre la app en Inicio, una vez por arranque.
import { chromium } from 'playwright';
import { renameSync } from 'node:fs';
const APP = 'http://localhost:8100', OUT = 'docs/evidencia/animacion-entrada';
const ok = (c, m) => { if (!c) throw new Error('FALLA: ' + m); console.log('✔', m); };
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 412, height: 917 }, recordVideo: { dir: OUT, size: { width: 412, height: 917 } } });
const p = await ctx.newPage();
const sale = async () => p.locator('.pp-splash').waitFor({ state: 'attached', timeout: 3000 }).then(() => true, () => false);

await p.goto(`${APP}/inicio`);
ok(await sale(), '1.ª apertura en Inicio: sale la animación');
await p.waitForTimeout(500); await p.screenshot({ path: `${OUT}/1-sello.png` });
await p.locator('.pp-splash').waitFor({ state: 'detached', timeout: 4000 });
ok(true, 'la animación termina sola y deja el Inicio');

await p.locator('a.pp-navbar__item[aria-current="false"]:visible', { hasText: 'Mascotas' }).click(); await p.waitForURL(/mascotas/);
await p.locator('a.pp-navbar__item[aria-current="false"]:visible', { hasText: 'Inicio' }).click(); await p.waitForURL(/inicio/);
ok(!(await sale()), 'volver al Inicio desde otra pestaña: no sale');

await p.reload();
ok(await sale(), '2.ª apertura (recargar = abrir otra vez): vuelve a salir');
await p.waitForTimeout(2000);

await p.goto(`${APP}/mascotas`); // abrir la app en otra pantalla
await p.locator('a.pp-navbar__item[aria-current="false"]:visible', { hasText: 'Inicio' }).click(); await p.waitForURL(/inicio/);
await p.waitForTimeout(300);
ok(!(await p.locator('.pp-splash').count()), 'abrir la app en otra pantalla y llegar al Inicio: no sale');
const video = await p.video().path();
await ctx.close();
renameSync(video, `${OUT}/dos-aperturas.webm`);

const rm = await b.newPage({ viewport: { width: 412, height: 917 }, reducedMotion: 'reduce' });
await rm.goto(`${APP}/inicio`); await rm.waitForTimeout(800);
ok(!(await rm.locator('.pp-splash').count()), 'con «reducir movimiento» no sale');
await b.close();
console.log('TODO OK');
