import { DEMO_PASSWORD, TestCtx, bearer, login, register, startApp } from './helpers';

describe('auth', () => {
  let ctx: TestCtx;
  beforeAll(async () => (ctx = await startApp()));
  afterAll(() => ctx.close());

  it('registro: crea la cuenta e inicia sesión', async () => {
    const s = await register(ctx, 'Nueva@Correo.com');
    expect(s.accessToken).toBeTruthy();
    expect(s.refreshToken).toMatch(/^[0-9a-f]{24}\./);
    const me = await ctx.http().get('/auth/me').set(bearer(s.accessToken)).expect(200);
    expect(me.body).toMatchObject({ email: 'nueva@correo.com', hasTest: false });
  });

  it('la contraseña se guarda con hash argon2id, nunca en claro', async () => {
    await register(ctx, 'hash@correo.com', 'mi-contraseña-1234');
    const doc = await ctx.conn.collection('users').findOne({ email: 'hash@correo.com' });
    expect(doc!.passwordHash).toMatch(/^\$argon2id\$/);
    expect(JSON.stringify(doc)).not.toContain('mi-contraseña-1234');
  });

  it('EMAIL_ALREADY_REGISTERED si el correo ya existe (sin distinguir mayúsculas)', async () => {
    const res = await ctx.http().post('/auth/register').send({ email: 'PERSONA@ejemplo.com', password: '12345678' }).expect(409);
    expect(res.body).toEqual({ code: 'EMAIL_ALREADY_REGISTERED', message: expect.any(String), fields: { email: ['TAKEN'] } });
  });

  it('VALIDATION_FAILED con los campos marcados (Error-Registro-Campos)', async () => {
    const res = await ctx.http().post('/auth/register').send({ email: 'nombre@correo', password: '123456' }).expect(400);
    expect(res.body.code).toBe('VALIDATION_FAILED');
    expect(res.body.fields).toEqual({ email: ['FORMAT'], password: ['MIN_LENGTH'] });
  });

  it('AUTH_INVALID_CREDENTIALS con contraseña mala o correo inexistente (mismo error)', async () => {
    const a = await ctx.http().post('/auth/login').send({ email: 'persona@ejemplo.com', password: 'otra-cosa' }).expect(401);
    const b = await ctx.http().post('/auth/login').send({ email: 'nadie@ejemplo.com', password: 'otra-cosa' }).expect(401);
    expect(a.body.code).toBe('AUTH_INVALID_CREDENTIALS');
    expect(b.body).toEqual(a.body);
  });

  it('login de la cuenta demo con test', async () => {
    const s = await login(ctx, 'persona@ejemplo.com');
    expect(s.user.hasTest).toBe(true);
  });

  it('refresh rota el token; reutilizar uno viejo cierra toda la sesión', async () => {
    const s1 = await login(ctx, 'registrada@ejemplo.com');
    const s2 = (await ctx.http().post('/auth/refresh').send({ refreshToken: s1.refreshToken }).expect(200)).body;
    expect(s2.refreshToken).not.toBe(s1.refreshToken);
    // Reutilización del token ya rotado → 401 y se revoca también el nuevo.
    const reuse = await ctx.http().post('/auth/refresh').send({ refreshToken: s1.refreshToken }).expect(401);
    expect(reuse.body.code).toBe('REFRESH_INVALID');
    await ctx.http().post('/auth/refresh').send({ refreshToken: s2.refreshToken }).expect(401);
  });

  it('logout invalida el token de renovación', async () => {
    const s = await login(ctx, 'registrada@ejemplo.com');
    await ctx.http().post('/auth/logout').send({ refreshToken: s.refreshToken }).expect(204);
    await ctx.http().post('/auth/refresh').send({ refreshToken: s.refreshToken }).expect(401);
  });

  it('un token de renovación inventado no vale', async () => {
    const s = await login(ctx, 'registrada@ejemplo.com');
    const [id] = s.refreshToken.split('.');
    await ctx.http().post('/auth/refresh').send({ refreshToken: `${id}.inventado` }).expect(401);
  });

  it('AUTH_UNAUTHORIZED sin token o con un token falso', async () => {
    const a = await ctx.http().get('/auth/me').expect(401);
    expect(a.body.code).toBe('AUTH_UNAUTHORIZED');
    await ctx.http().get('/auth/me').set(bearer('no.es.un.jwt')).expect(401);
  });

  it('CORS solo para los orígenes configurados', async () => {
    const ok = await ctx.http().get('/health').set('Origin', 'http://localhost:8100');
    expect(ok.headers['access-control-allow-origin']).toBe('http://localhost:8100');
    const ko = await ctx.http().get('/health').set('Origin', 'https://malicioso.example');
    expect(ko.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('health responde ok con la base de datos', async () => {
    const res = await ctx.http().get('/health').expect(200);
    expect(res.body).toEqual({ status: 'ok', db: 'up' });
  });

  it('las contraseñas demo vienen de la variable de entorno', async () => {
    await ctx.http().post('/auth/login').send({ email: 'solicitud@ejemplo.com', password: DEMO_PASSWORD }).expect(200);
  });
});

describe('auth · límite de intentos', () => {
  let ctx: TestCtx;
  beforeAll(async () => (ctx = await startApp({ AUTH_THROTTLE_LIMIT: '3' })));
  afterAll(() => ctx.close());

  it('TOO_MANY_ATTEMPTS al pasar el límite de login', async () => {
    for (let i = 0; i < 3; i++) await ctx.http().post('/auth/login').send({ email: 'persona@ejemplo.com', password: 'mal-mal-mal' }).expect(401);
    const res = await ctx.http().post('/auth/login').send({ email: 'persona@ejemplo.com', password: 'mal-mal-mal' }).expect(429);
    expect(res.body.code).toBe('TOO_MANY_ATTEMPTS');
  });

  it('el límite no afecta a las rutas normales', async () => {
    for (let i = 0; i < 6; i++) await ctx.http().get('/pets').expect(200);
  });
});
