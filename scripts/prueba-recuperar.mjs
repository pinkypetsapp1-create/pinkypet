// Prueba del flujo «¿Has olvidado tu contraseña?» contra la API y la app en local. Uso: node scripts/prueba-recuperar.mjs <log de la API>
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
const LOG = process.argv[2];
const APP = 'http://localhost:8100', API = 'http://localhost:3000', OUT = 'docs/evidencia/recuperar';
const email = `olvido.${Date.now()}@ejemplo.com`;
const ok = (c, m) => { if (!c) throw new Error('FALLA: ' + m); console.log('✔', m); };

await fetch(`${API}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password: 'antigua-123' }) });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 412, height: 917 }, deviceScaleFactor: 2 });
const visible = (t) => page.getByText(t).first().waitFor({ timeout: 5000 }).then(() => true, () => false);
const shot = (n) => page.screenshot({ path: `${OUT}/${n}.png` });

// Registro: repetir contraseña
await page.goto(`${APP}/registro`);
await page.getByLabel('Correo electrónico').fill('nueva@ejemplo.com');
await page.getByLabel('Contraseña', { exact: true }).fill('perro1234');
await page.getByLabel('Repetir contraseña').fill('perro12');
await page.getByRole('button', { name: 'Crear cuenta y hacer el test' }).click();
ok(await visible('Las contraseñas no coinciden.'), 'Registro: «Las contraseñas no coinciden.»');
ok(await visible('Revisa el campo marcado para crear tu cuenta.'), 'Registro: resumen de 1 campo');
await shot('1-registro-no-coinciden');
await page.getByLabel('Correo electrónico').fill('x');
await page.getByLabel('Contraseña', { exact: true }).fill('');
await page.getByLabel('Repetir contraseña').fill('');
await page.getByRole('button', { name: 'Crear cuenta y hacer el test' }).click();
ok(await visible('Revisa los 3 campos marcados para crear tu cuenta.'), 'Registro: resumen de 3 campos');
await shot('2-registro-3-campos');

// Login → Recuperar (lleva el correo escrito)
await page.goto(`${APP}/login`);
await page.getByLabel('Correo electrónico').fill(email);
await shot('3-login-olvido');
await page.getByRole('link', { name: '¿Has olvidado tu contraseña?' }).click();
await page.waitForURL(/\/recuperar/);
const rec = page.locator('pp-recuperar');
ok((await rec.getByLabel('Correo electrónico').inputValue()) === email, 'Recuperar: el correo llega ya escrito');
await shot('4-recuperar');
await rec.getByRole('button', { name: 'Enviar enlace' }).click();
await rec.getByText('Revisa tu correo').waitFor();
await shot('5-recuperar-enviado');

// El enlace del «correo» (en local se escribe en el registro de la API)
await page.waitForTimeout(500);
const links = [...readFileSync(LOG, 'utf8').matchAll(/http:\/\/localhost:8100\/nueva-contrasena\?token=\S+/g)].map((m) => m[0]);
const link = links.at(-1);
ok(!!link, 'el correo lleva el enlace a Nueva contraseña');

await page.goto(link);
await page.getByLabel('Nueva contraseña').fill('nueva-1234');
await page.getByLabel('Repetir contraseña').fill('nueva-12');
await page.getByRole('button', { name: 'Guardar contraseña' }).click();
ok(await visible('Las contraseñas no coinciden.'), 'Nueva contraseña: no coinciden');
await shot('6-nueva-error');
await page.getByLabel('Repetir contraseña').fill('nueva-1234');
await shot('7-nueva-contrasena');
await page.getByRole('button', { name: 'Guardar contraseña' }).click();
await page.getByText('Contraseña cambiada').waitFor();
await shot('8-nueva-hecha');

await page.goto(link);
await page.getByText('Este enlace ya no sirve').waitFor();
ok(true, 'el enlace ya usado muestra «Este enlace ya no sirve»');
await shot('9-nueva-caducado');

await page.goto(`${APP}/login`);
await page.getByLabel('Correo electrónico').fill(email);
await page.getByLabel('Contraseña').fill('nueva-1234');
await page.getByRole('button', { name: 'Iniciar sesión' }).first().click();
await page.waitForURL(/\/inicio/);
ok(true, 'inicia sesión con la contraseña nueva');

// Modo oscuro y pantalla estrecha (206 px) de Recuperar
await page.emulateMedia({ colorScheme: 'dark' });
await page.goto(`${APP}/perfil`);
await page.evaluate(() => localStorage.clear()); await page.context().clearCookies();
const p2 = await browser.newPage({ viewport: { width: 412, height: 917 }, deviceScaleFactor: 2, colorScheme: 'dark' });
await p2.goto(`${APP}/recuperar`); await p2.getByText('Enviar enlace').waitFor();
await p2.screenshot({ path: `${OUT}/10-recuperar-oscuro.png` });
const p3 = await browser.newPage({ viewport: { width: 206, height: 917 }, deviceScaleFactor: 2 });
await p3.goto(`${APP}/nueva-contrasena?token=x.y`); await p3.getByText('Este enlace ya no sirve').waitFor();
await p3.screenshot({ path: `${OUT}/11-caducado-206.png` });
await p3.goto(`${APP}/recuperar`); await p3.getByText('Enviar enlace').waitFor();
await p3.screenshot({ path: `${OUT}/12-recuperar-206.png` });
await browser.close();
console.log('TODO OK');
