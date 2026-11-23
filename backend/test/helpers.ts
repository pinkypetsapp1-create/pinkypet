import 'reflect-metadata';
import { INestApplication } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection } from 'mongoose';
import request from 'supertest';
import { createApp } from '../src/app.factory';
import { Env, loadEnv } from '../src/config/env';
import { runSeed } from '../src/seed/seed';

jest.setTimeout(120_000);

export const DEMO_PASSWORD = 'demo-password-e2e';
export const DEV_KEY = 'clave-dev-de-los-tests';

export interface TestCtx {
  app: INestApplication;
  http: () => ReturnType<typeof request>;
  conn: Connection;
  env: Env;
  close: () => Promise<void>;
}

/** Levanta una MongoDB en memoria, la API completa y el seed. */
export async function startApp(overrides: Record<string, string> = {}): Promise<TestCtx> {
  const mongo = await MongoMemoryServer.create();
  const env = loadEnv({
    NODE_ENV: 'test',
    MONGODB_URI: mongo.getUri('pinkypet-e2e'),
    JWT_SECRET: 'a'.repeat(40),
    JWT_REFRESH_SECRET: 'b'.repeat(40),
    CORS_ORIGINS: 'http://localhost:8100',
    AUTH_THROTTLE_LIMIT: '1000',
    DEV_KEY,
    ...overrides,
  });
  const app = await createApp(env, { logger: false });
  await app.init();
  const conn = app.get<Connection>(getConnectionToken());
  await runSeed(conn, DEMO_PASSWORD);
  return {
    app,
    conn,
    env,
    http: () => request(app.getHttpServer()),
    close: async () => {
      await app.close();
      await mongo.stop();
    },
  };
}

export async function login(ctx: TestCtx, email: string, password = DEMO_PASSWORD) {
  const res = await ctx.http().post('/auth/login').send({ email, password }).expect(200);
  return res.body as { accessToken: string; refreshToken: string; user: { id: string; hasTest: boolean } };
}

export async function register(ctx: TestCtx, email: string, password = 'contraseña-larga') {
  const res = await ctx.http().post('/auth/register').send({ email, password }).expect(201);
  return res.body as { accessToken: string; refreshToken: string; user: { id: string } };
}

export const bearer = (token: string) => ({ Authorization: `Bearer ${token}` });
