import { GoogleVerifier } from '../src/auth/google-verifier';
import { TestCtx, bearer, startApp } from './helpers';

// Google se simula: cada «idToken» de prueba se traduce a una identidad fija. Lo real se prueba en el emulador.
const IDENTIDADES: Record<string, { sub: string; email: string } | null> = {
  'token-nueva': { sub: 'g-1', email: 'Nueva.Google@gmail.com' },
  'token-existente': { sub: 'g-2', email: 'persona@ejemplo.com' },
  'token-falso': null,
};

describe('Continuar con Google', () => {
  let ctx: TestCtx;
  beforeAll(async () => {
    ctx = await startApp({ GOOGLE_CLIENT_IDS: 'cliente-web.apps.googleusercontent.com,cliente-android.apps.googleusercontent.com' });
    jest.spyOn(ctx.app.get(GoogleVerifier), 'verify').mockImplementation(async (t) => IDENTIDADES[t] ?? null);
  });
  afterAll(() => ctx.close());

  it('crea la cuenta la primera vez (created: true) y entra la segunda (created: false)', async () => {
    const a = (await ctx.http().post('/auth/google').send({ idToken: 'token-nueva' }).expect(200)).body;
    expect(a).toMatchObject({ created: true, user: { email: 'nueva.google@gmail.com', hasTest: false } });
    const b = (await ctx.http().post('/auth/google').send({ idToken: 'token-nueva' }).expect(200)).body;
    expect(b).toMatchObject({ created: false, user: { id: a.user.id } });
    await ctx.http().get('/auth/me').set(bearer(b.accessToken)).expect(200);
  });

  it('con el correo de una cuenta existente entra en esa misma cuenta (con su test)', async () => {
    const s = (await ctx.http().post('/auth/google').send({ idToken: 'token-existente' }).expect(200)).body;
    expect(s).toMatchObject({ created: false, user: { email: 'persona@ejemplo.com', hasTest: true } });
    const doc = await ctx.conn.collection('users').findOne({ email: 'persona@ejemplo.com' });
    expect(doc!.googleSub).toBe('g-2');
  });

  it('GOOGLE_TOKEN_INVALID si Google no lo valida', async () => {
    const r = await ctx.http().post('/auth/google').send({ idToken: 'token-falso' }).expect(401);
    expect(r.body.code).toBe('GOOGLE_TOKEN_INVALID');
  });

  it('VALIDATION_FAILED sin idToken', async () => {
    const r = await ctx.http().post('/auth/google').send({}).expect(400);
    expect(r.body).toMatchObject({ code: 'VALIDATION_FAILED', fields: { idToken: expect.arrayContaining(['REQUIRED']) } });
  });

  it('una cuenta creada con Google no tiene una contraseña que se pueda usar', async () => {
    const doc = await ctx.conn.collection('users').findOne({ email: 'nueva.google@gmail.com' });
    expect(doc!.passwordHash).toMatch(/^\$argon2id\$/);
    await ctx.http().post('/auth/login').send({ email: 'nueva.google@gmail.com', password: '' }).expect(400);
  });
});

describe('Continuar con Google sin configurar', () => {
  let ctx: TestCtx;
  beforeAll(async () => (ctx = await startApp()));
  afterAll(() => ctx.close());

  it('GOOGLE_NOT_CONFIGURED si no hay GOOGLE_CLIENT_IDS', async () => {
    const r = await ctx.http().post('/auth/google').send({ idToken: 'lo-que-sea' }).expect(503);
    expect(r.body.code).toBe('GOOGLE_NOT_CONFIGURED');
  });
});
