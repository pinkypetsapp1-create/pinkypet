import 'reflect-metadata';
import { createApp } from './app.factory';
import { loadEnv } from './config/env';

async function main(): Promise<void> {
  const env = loadEnv();
  const app = await createApp(env);
  await app.listen(env.port, '0.0.0.0');
  console.log(`Pinky Pet API en el puerto ${env.port} · documentación en /docs`);
}

void main();
