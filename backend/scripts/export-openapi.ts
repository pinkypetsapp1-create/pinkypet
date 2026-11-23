// npm run openapi · escribe backend/openapi.json (contrato de la API para tipar la app en la Fase 2).
import 'reflect-metadata';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { buildOpenApi, createApp } from '../src/app.factory';
import { loadEnv } from '../src/config/env';

async function main(): Promise<void> {
  const mongo = await MongoMemoryServer.create();
  const env = loadEnv({
    NODE_ENV: 'production', // el contrato público no incluye el simulador de desarrollo
    MONGODB_URI: mongo.getUri('openapi'),
    JWT_SECRET: 'x'.repeat(32),
    JWT_REFRESH_SECRET: 'y'.repeat(32),
  });
  const app = await createApp(env, { logger: false });
  await app.init();
  const out = join(__dirname, '..', 'openapi.json');
  writeFileSync(out, JSON.stringify(buildOpenApi(app), null, 2) + '\n');
  await app.close();
  await mongo.stop();
  console.log(`Escrito ${out}`);
}

void main();
