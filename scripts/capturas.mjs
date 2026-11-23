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
};

async function refreshTokenFor(email) {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password: DEMO_PASSWORD }),
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
  for (const v of VARIANTES) {
    const ctx = await browser.newContext({ viewport: { width: v.w, height: v.h }, deviceScaleFactor: 2, colorScheme: v.tema, reducedMotion: 'reduce' });
    if (e.cuenta) {
      const token = await refreshTokenFor(e.cuenta);
      await ctx.addInitScript((t) => sessionStorage.setItem('pp.refresh', t), token);
    }
    const page = await ctx.newPage();
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
