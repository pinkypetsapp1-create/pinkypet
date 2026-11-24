import 'reflect-metadata';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { createApp } from './app.factory';
import { loadEnv } from './config/env';
import { runSeed } from './seed/seed';

async function main(): Promise<void> {
  const env = loadEnv();
  const app = await createApp(env);
  await seedIfEmpty(app.get<Connection>(getConnectionToken()));
  await app.listen(env.port, '0.0.0.0');
  console.log(`Pinky Pet API en el puerto ${env.port} · documentación en /docs`);
}

/**
 * Decisión F3-3: la primera vez que arranca contra una base de datos vacía, carga mascotas, preguntas y cuentas demo.
 * No se repite en cada arranque (Render se duerme y despierta), para no borrar las solicitudes de la demo.
 * Para reiniciar la demo a mano: `npm run seed` con la MONGODB_URI de Atlas.
 */
async function seedIfEmpty(conn: Connection): Promise<void> {
  const password = process.env.SEED_DEMO_PASSWORD ?? '';
  if (!password) return;
  if ((await conn.collection('pets').estimatedDocumentCount()) > 0) return;
  const r = await runSeed(conn, password);
  console.log(`Base de datos vacía: seed inicial hecho (${r.pets} mascotas, ${r.questions} preguntas, ${r.demoUsers.length} cuentas demo).`);
}

void main();
