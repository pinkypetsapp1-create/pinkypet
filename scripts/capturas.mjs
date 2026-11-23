#!/usr/bin/env node
// Capturas de la app a tamaño de artboard (412 × 917, o 206 × 459 para «Zoom»), en claro y oscuro.
// Requiere la API (cd backend && npm run dev:mem) y la app (cd app && npx ng serve --port 8100).
// Uso: node scripts/capturas.mjs [entrega] [carpeta-salida]   (por defecto: 2a docs/evidencia/2a)
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const APP = process.env.APP_URL ?? 'http://localhost:8100';
const API = process.env.API_URL ?? 'http://localhost:3000';
const DEMO_PASSWORD = process.env.SEED_DEMO_PASSWORD ?? 'demo-local-1234';
const [entrega = '2a', outDir = `docs/evidencia/${entrega}`] = process.argv.slice(2);

const CUENTA = { registrada: 'registrada@ejemplo.com', conTest: 'persona@ejemplo.com', conSolicitud: 'solicitud@ejemplo.com' };

/** Cada escenario tiene el nombre del artboard de Alta fidelidad con el que se compara. */
const ESCENARIOS = {
  '2a': [
    { nombre: 'Main', ruta: '/inicio' },
    { nombre: 'Inicio-Registrado', ruta: '/inicio', cuenta: CUENTA.registrada },
    { nombre: 'Inicio-Sesion', ruta: '/inicio', cuenta: CUENTA.conTest },
    { nombre: 'Registro', ruta: '/registro' },
    {
      nombre: 'Error-Registro-Campos', ruta: '/registro',
      acciones: async (p) => {
        await p.getByLabel('Correo electrónico').fill('nombre@correo');
        await p.getByLabel('Contraseña').fill('123456');
        await p.getByRole('button', { name: 'Crear cuenta y hacer el test' }).click();
      },
    },
    {
      nombre: 'Error-Registro-Existe', ruta: '/registro',
      acciones: async (p) => {
        await p.getByLabel('Correo electrónico').fill(CUENTA.conTest);
        await p.getByLabel('Contraseña').fill('una-contraseña-larga');
        await p.getByRole('button', { name: 'Crear cuenta y hacer el test' }).click();
        await p.getByText('Ya existe una cuenta con este correo.').waitFor();
      },
    },
    { nombre: 'Login', ruta: '/login' },
    {
      nombre: 'Error-Login', ruta: '/login',
      acciones: async (p) => {
        await p.getByLabel('Correo electrónico').fill(CUENTA.conTest);
        await p.getByLabel('Contraseña').fill('contraseña-incorrecta');
        await p.getByRole('button', { name: 'Iniciar sesión' }).click();
        await p.getByText('El correo o la contraseña no son correctos.', { exact: false }).waitFor();
      },
    },
    { nombre: 'Test', ruta: '/test', cuenta: CUENTA.registrada },
    {
      nombre: 'Test-Error', ruta: '/test', cuenta: CUENTA.registrada,
      acciones: async (p) => {
        await p.getByRole('radio').first().check();
        await p.getByRole('button', { name: 'Ver mis mascotas compatibles' }).click();
      },
    },
    { nombre: 'Test-Completado', ruta: '/test', cuenta: CUENTA.conTest },
  ],
  '2b': [
    { nombre: 'Catalogo', ruta: '/mascotas' },
    { nombre: 'Catalogo-Registrado', ruta: '/mascotas', cuenta: CUENTA.registrada },
    { nombre: 'Compatibles', ruta: '/mascotas', cuenta: CUENTA.conTest },
    { nombre: 'Compatibles-Limite-Luna', ruta: '/mascotas', cuenta: CUENTA.conSolicitud },
    { nombre: 'Error-Catalogo', ruta: '/mascotas', cortar: '**/pets?*' },
    { nombre: 'Error-SinCompatibles', ruta: '/mascotas', cuenta: async () => cuentaNueva(RESPUESTAS_LEJANAS) },
    {
      nombre: 'Catalogo-Filtros-Vacio', ruta: '/mascotas',
      acciones: async (p) => {
        await p.getByRole('button', { name: /^Ubicación/ }).click();
        await p.getByRole('menuitemradio', { name: 'Madrid' }).click();
        await p.getByText('No hay mascotas con estos filtros').waitFor();
      },
    },
    { nombre: 'Ficha-Luna', ruta: '/mascotas/luna', cuenta: CUENTA.conTest },
    { nombre: 'Ficha-Luna-Enviada', ruta: '/mascotas/luna', cuenta: CUENTA.conSolicitud },
    {
      nombre: 'Ficha-Limite', ruta: '/mascotas/rocky', cuenta: CUENTA.conSolicitud,
      acciones: async (p) => { await p.getByRole('button', { name: 'Enviar solicitud de adopción' }).click(); },
    },
    {
      nombre: 'Ficha-Confirmar', ruta: '/mascotas/luna', cuenta: CUENTA.conTest,
      acciones: async (p) => { await p.getByRole('button', { name: 'Enviar solicitud de adopción' }).click(); },
    },
    {
      nombre: 'Error-Envio', ruta: '/mascotas/luna', cuenta: CUENTA.conTest, cortar: '**/requests',
      acciones: async (p) => {
        await p.getByRole('button', { name: 'Enviar solicitud de adopción' }).click();
        await p.getByRole('button', { name: 'Sí, enviar solicitud' }).click();
        await p.getByText('No se ha podido enviar tu solicitud').waitFor();
      },
    },
  ],
};

ESCENARIOS['2c'] = [
  { nombre: 'ComoAdoptar', ruta: '/proceso' },
  { nombre: 'ComoAdoptar-Registrado', ruta: '/proceso', cuenta: CUENTA.registrada },
  { nombre: 'ComoAdoptar-Sesion', ruta: '/proceso', cuenta: CUENTA.conTest },
  { nombre: 'ComoAdoptar-Sesion-Luna', ruta: '/proceso', cuenta: CUENTA.conSolicitud },
  { nombre: 'SinSolicitud', ruta: '/proceso/solicitud' },
  { nombre: 'SinSolicitud-Sesion', ruta: '/proceso/solicitud', cuenta: CUENTA.conTest },
  { nombre: 'MiSolicitud', ruta: '/proceso/solicitud', cuenta: CUENTA.conSolicitud },
  { nombre: 'Estado-Luna', ruta: '/proceso/solicitud?aviso=1', cuenta: CUENTA.conSolicitud },
  {
    nombre: 'Error-Cancelar', ruta: '/proceso/solicitud', cuenta: CUENTA.conSolicitud, cortar: '**/cancel',
    acciones: async (p) => {
      await p.getByRole('button', { name: 'Cancelar solicitud' }).click();
      await p.getByRole('button', { name: 'Sí, cancelar solicitud' }).click();
      await p.getByText('No se ha podido cancelar tu solicitud').waitFor();
    },
  },
  {
    nombre: 'Estado-Cancelada', ruta: '/proceso/solicitud', cuenta: async () => cuentaConSolicitud('coco'), porVariante: true,
    acciones: async (p) => {
      await p.getByRole('button', { name: 'Cancelar solicitud' }).click();
      await p.getByRole('button', { name: 'Sí, cancelar solicitud' }).click();
      await p.getByText('Has cancelado tu solicitud').waitFor();
    },
  },
  { nombre: 'PerfilVacio', ruta: '/perfil' },
  { nombre: 'PerfilVacio-Registrado', ruta: '/perfil', cuenta: CUENTA.registrada },
  { nombre: 'PerfilCompletado', ruta: '/perfil', cuenta: CUENTA.conTest },
  // Al final: la respuesta de la protectora deja la mascota no disponible (npm run dev:mem la restablece).
  { nombre: 'Estado-Finalizada', ruta: '/proceso/solicitud', cuenta: async () => cuentaConSolicitud('nube', 'finalizada') },
  { nombre: 'Estado-NoDisponible', ruta: '/proceso/solicitud', cuenta: async () => cuentaConSolicitud('simba', 'rechazada') },
];

/** Cuenta nueva con el test de la demo y una solicitud; opcionalmente, ya respondida por la protectora. */
async function cuentaConSolicitud(petId, resultado) {
  const email = `captura-${Date.now()}-${Math.round(Math.random() * 1e6)}@ejemplo.com`;
  const call = (path, body, token, method = 'POST', extra = {}) => fetch(`${API}${path}`, {
    method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...extra }, body: JSON.stringify(body),
  }).then((r) => r.json());
  const s = await call('/auth/register', { email, password: 'contraseña-de-captura' });
  await call('/test/answers', { answers: RESPUESTAS_DEMO }, s.accessToken, 'PUT');
  const r = await call('/requests', { petId }, s.accessToken);
  if (resultado) await call(`/dev/requests/${r.id}/resolve`, { resultado }, null, 'POST', { 'X-Dev-Key': process.env.DEV_KEY ?? 'clave-local' });
  return { email, password: 'contraseña-de-captura' };
}

const RESPUESTAS_DEMO = {
  q1: 'No', q2: 'No', q3: 'Vivo sola o solo', q4: 'Piso con terraza o balcón', q5: 'Sí, el alquiler lo permite',
  q6: 'Entre 4 y 8 horas', q7: 'Entre 1 y 2 horas', q8: 'Familia o amistades', q9: 'Tranquilo', q10: 'Sí, en casa familiar',
  q11: 'Pequeño', q12: 'Medio', q13: 'Me da igual', q14: 'Entre 50 y 100 €', q15: 'Depende de sus necesidades',
};

const RESPUESTAS_LEJANAS = {
  q1: 'Sí', q2: 'Sí, otras mascotas', q3: 'No', q4: 'Piso sin terraza', q5: 'No lo sé',
  q6: 'Más de 8 horas', q7: 'Menos de 1 hora', q8: 'No lo sé todavía', q9: 'Muy activo', q10: 'Nunca',
  q11: 'Grande', q12: 'Alto', q13: 'Cachorro', q14: 'Menos de 50 €', q15: 'No',
};

/** Cuenta nueva con unas respuestas dadas. Devuelve su token de renovación. */
async function cuentaNueva(answers) {
  const email = `captura-${Date.now()}-${Math.round(Math.random() * 1e6)}@ejemplo.com`;
  const post = (path, body, token, method = 'POST') => fetch(`${API}${path}`, {
    method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(body),
  }).then((r) => r.json());
  const s = await post('/auth/register', { email, password: 'contraseña-de-captura' });
  await post('/test/answers', { answers }, s.accessToken, 'PUT');
  return { email, password: 'contraseña-de-captura' };
}

async function refreshTokenFor(email, password = DEMO_PASSWORD) {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(`No se pudo iniciar sesión como ${email}: ${res.status}`);
  return (await res.json()).refreshToken;
}

const VARIANTES = [
  { sufijo: '', tema: 'light', w: 412, h: 917 },
  { sufijo: '.oscuro', tema: 'dark', w: 412, h: 917 },
  { sufijo: '.206', tema: 'light', w: 206, h: 459 },
];

const browser = await chromium.launch();
mkdirSync(outDir, { recursive: true });
let n = 0;
for (const e of ESCENARIOS[entrega] ?? []) {
  // Las cuentas creadas para un escenario se crean una sola vez; cada variante inicia sesión (los tokens rotan).
  let creada = typeof e.cuenta === 'function' ? await e.cuenta() : null;
  for (const v of VARIANTES) {
    if (e.porVariante && v !== VARIANTES[0]) creada = await e.cuenta(); // la acción consume el estado (p. ej., cancelar)
    const ctx = await browser.newContext({ viewport: { width: v.w, height: v.h }, deviceScaleFactor: 2, colorScheme: v.tema, reducedMotion: 'reduce' });
    if (e.cuenta) {
      const token = creada ? await refreshTokenFor(creada.email, creada.password) : await refreshTokenFor(e.cuenta);
      await ctx.addInitScript((t) => sessionStorage.setItem('pp.refresh', t), token);
    }
    const page = await ctx.newPage();
    if (e.cortar) await page.route(e.cortar, (r) => (r.request().resourceType() === 'fetch' && r.request().method() !== 'OPTIONS' ? r.abort('internetdisconnected') : r.continue()));
    await page.goto(APP + e.ruta, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    if (e.acciones) await e.acciones(page);
    await page.waitForTimeout(300);
    const file = join(outDir, `${e.nombre}${v.sufijo}.png`);
    await page.screenshot({ path: file });
    await ctx.close();
    n++;
  }
}
await browser.close();
console.log(`${n} capturas en ${outDir}`);
