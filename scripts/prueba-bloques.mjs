// Prueba de las ventanas de «Qué tiene en cuenta el test» (Inicio). Necesita API y app en local.
import { chromium } from 'playwright';
const APP = 'http://localhost:8100', API = 'http://localhost:3000', OUT = 'docs/evidencia/bloques-test';
const ok = (c, m) => { if (!c) throw new Error('FALLA: ' + m); console.log('✔', m); };
const b = await chromium.launch();
const nueva = async (opts = {}) => { const ctx = await b.newContext({ viewport: { width: 412, height: 917 }, deviceScaleFactor: 2, reducedMotion: 'reduce', ...opts }); return ctx.newPage(); };
const caja = (p, n) => p.locator('pp-inicio:visible button.pp-ring-tile', { hasText: n });
const dialogo = (p) => p.locator('[role="dialog"]');

// Sin cuenta
let p = await nueva();
await p.goto(`${APP}/inicio`); await caja(p, 'Mi hogar').waitFor();
for (const [n, f, frase] of [['Mi hogar', 'hogar', 'Cuenta un 34 %'], ['Mi día a día', 'dia', 'cuántas horas estaría sola'], ['La mascota que busco', 'mascota', 'necesidades especiales']]) {
  await caja(p, n).scrollIntoViewIfNeeded(); await caja(p, n).click();
  await dialogo(p).waitFor();
  ok((await dialogo(p).locator('h2').textContent()).trim() === n && (await dialogo(p).textContent()).includes(frase), `«${n}»: se abre su ventana con su texto`);
  ok((await p.evaluate(() => document.activeElement?.textContent?.trim())) === 'Hacer el test de compatibilidad', `«${n}»: el foco empieza en el botón`);
  await p.screenshot({ path: `${OUT}/${f}.png` });
  await p.getByRole('button', { name: 'Cerrar', exact: true }).last().click();
  await dialogo(p).waitFor({ state: 'detached' });
  ok((await p.evaluate(() => document.activeElement?.getAttribute('aria-label') ?? '')).startsWith(n + ','), `«${n}»: al cerrar, el foco vuelve a su caja`);
}
await caja(p, 'Mi hogar').click(); await dialogo(p).waitFor(); await p.keyboard.press('Escape');
ok(await dialogo(p).waitFor({ state: 'detached', timeout: 3000 }).then(() => true, () => false), 'Escape cierra la ventana');
await caja(p, 'Mi hogar').click(); await dialogo(p).waitFor(); await p.locator('.pp-scrim').click({ position: { x: 10, y: 10 } });
ok(await dialogo(p).waitFor({ state: 'detached', timeout: 3000 }).then(() => true, () => false), 'tocar el velo cierra la ventana');
await caja(p, 'Mi hogar').click(); await p.getByRole('link', { name: 'Hacer el test de compatibilidad' }).click();
await p.waitForURL(/registro/); ok(true, 'sin cuenta: el botón lleva a Registro');

// Registrada sin test
const email = `bloques.${Date.now()}@ejemplo.com`;
const reg = await (await fetch(`${API}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password: 'clave-1234' }) })).json();
void reg;
p = await nueva();
await p.goto(`${APP}/login`); await p.getByLabel('Correo electrónico').fill(email); await p.getByLabel('Contraseña').fill('clave-1234');
await p.getByRole('button', { name: 'Iniciar sesión' }).first().click(); await p.waitForURL(/inicio/);
await caja(p, 'Mi día a día').click(); await dialogo(p).waitFor();
await p.getByRole('link', { name: 'Hacer el test de compatibilidad' }).click(); await p.waitForURL(/\/test/);
ok(true, 'registrada sin test: el botón lleva al Test');

// Con el test hecho (cuenta demo)
p = await nueva();
await p.goto(`${APP}/login`); await p.getByLabel('Correo electrónico').fill('persona@ejemplo.com'); await p.getByLabel('Contraseña').fill('demo-local-1234');
await p.getByRole('button', { name: 'Iniciar sesión' }).first().click(); await p.waitForURL(/inicio/);
await caja(p, 'La mascota que busco').click(); await dialogo(p).waitFor();
ok(await p.getByRole('link', { name: 'Revisar mis respuestas' }).isVisible(), 'con test: el botón es «Revisar mis respuestas»');
await p.screenshot({ path: `${OUT}/con-test.png` });
await p.getByRole('link', { name: 'Revisar mis respuestas' }).click(); await p.waitForURL(/perfil/);
ok(true, 'con test: lleva a Mi perfil');

// Oscuro y 206 px
p = await nueva({ colorScheme: 'dark' });
await p.goto(`${APP}/inicio`); await caja(p, 'Mi hogar').click(); await dialogo(p).waitFor(); await p.screenshot({ path: `${OUT}/hogar.oscuro.png` });
p = await nueva({ viewport: { width: 206, height: 458 } });
await p.goto(`${APP}/inicio`); await caja(p, 'Mi hogar').scrollIntoViewIfNeeded(); await caja(p, 'Mi hogar').click(); await dialogo(p).waitFor();
await p.screenshot({ path: `${OUT}/hogar.206.png` });
await p.getByRole('button', { name: 'Cerrar', exact: true }).last().scrollIntoViewIfNeeded();
ok(await p.getByRole('button', { name: 'Cerrar', exact: true }).last().isVisible(), '206 px: la ventana se desplaza y sus botones se alcanzan');
await p.screenshot({ path: `${OUT}/hogar.206-botones.png` });
await b.close();
console.log('TODO OK');
