// npm run dev:mem · arranca la API con una MongoDB en memoria y el seed hecho. Para probar sin Atlas.
// Los datos se pierden al parar. La contraseña demo sale de SEED_DEMO_PASSWORD (o .env).
import 'reflect-metadata';
import { randomBytes } from 'node:crypto';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from '../src/app.factory';
import { loadEnv } from '../src/config/env';
import { runSeed } from '../src/seed/seed';
import { loadDotEnv } from './dotenv';

async function main(): Promise<void> {
  loadDotEnv();
  const mongo = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongo.getUri('pinkypet');
  process.env.JWT_SECRET ||= randomBytes(48).toString('base64');
  process.env.JWT_REFRESH_SECRET ||= randomBytes(48).toString('base64');
  if (!process.env.SEED_DEMO_PASSWORD) throw new Error('Define SEED_DEMO_PASSWORD (en backend/.env) para crear las cuentas demo');
  const conn = await mongoose.createConnection(process.env.MONGODB_URI).asPromise();
  await runSeed(conn, process.env.SEED_DEMO_PASSWORD);
  await conn.close();
  const env = loadEnv();
  const app = await createApp(env);
  await app.listen(env.port, '0.0.0.0');
  console.log(`API en memoria: http://localhost:${env.port} · Swagger: http://localhost:${env.port}/docs`);
}

void main();
