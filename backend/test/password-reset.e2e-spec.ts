import { Mail, Mailer } from '../src/mail/mailer';
import { TestCtx, bearer, startApp } from './helpers';

// El correo no sale: el cartero se sustituye y guarda los mensajes para leer el enlace.
describe('Recuperar contraseña', () => {
  let ctx: TestCtx;
  const enviados: Mail[] = [];
  const tokenDelUltimoCorreo = () => new URL(enviados.at(-1)!.text.match(/https?:\/\/\S+/)![0]).searchParams.get('token')!;

  beforeAll(async () => {
    ctx = await startApp({ APP_URL: 'https://pinky-pet-app.onrender.com/' });
    jest.spyOn(ctx.app.get(Mailer), 'send').mockImplementation(async (m) => void enviados.push(m));
    await ctx.http().post('/auth/register').send({ email: 'olvido@ejemplo.com', password: 'antigua-123' }).expect(201);
  });
  afterAll(() => ctx.close());

  it('responde igual exista o no la cuenta, y solo envía correo si existe', async () => {
    const a = await ctx.http().post('/auth/password/forgot').send({ email: 'nadie@ejemplo.com' }).expect(202);
    expect(enviados).toHaveLength(0);
    const b = await ctx.http().post('/auth/password/forgot').send({ email: 'Olvido@Ejemplo.com' }).expect(202);
    expect(b.body).toEqual(a.body);
    expect(enviados).toHaveLength(1);
    expect(enviados[0].to).toBe('olvido@ejemplo.com');
    expect(enviados[0].text).toContain('https://pinky-pet-app.onrender.com/nueva-contrasena?token=');
  });

  it('el secreto no se guarda en claro', async () => {
    const [, secreto] = tokenDelUltimoCorreo().split('.');
    const doc = await ctx.conn.collection('password_resets').findOne({});
    expect(doc!.secretHash).not.toContain(secreto);
  });

  it('cambia la contraseña, cierra las sesiones y el enlace no se puede reutilizar', async () => {
    const sesion = (await ctx.http().post('/auth/login').send({ email: 'olvido@ejemplo.com', password: 'antigua-123' }).expect(200)).body;
    const token = tokenDelUltimoCorreo();
    await ctx.http().get('/auth/password/reset').query({ token }).expect(200);
    await ctx.http().post('/auth/password/reset').send({ token, password: 'nueva-1234' }).expect(200);

    await ctx.http().post('/auth/login').send({ email: 'olvido@ejemplo.com', password: 'antigua-123' }).expect(401);
    await ctx.http().post('/auth/login').send({ email: 'olvido@ejemplo.com', password: 'nueva-1234' }).expect(200);
    const r = await ctx.http().post('/auth/refresh').send({ refreshToken: sesion.refreshToken }).expect(401);
    expect(r.body.code).toBe('REFRESH_INVALID');

    const otra = await ctx.http().post('/auth/password/reset').send({ token, password: 'otra-12345' }).expect(410);
    expect(otra.body.code).toBe('RESET_TOKEN_INVALID');
    await ctx.http().get('/auth/password/reset').query({ token }).expect(410);
  });

  it('pedir un enlace nuevo anula el anterior', async () => {
    await ctx.http().post('/auth/password/forgot').send({ email: 'olvido@ejemplo.com' }).expect(202);
    const primero = tokenDelUltimoCorreo();
    await ctx.http().post('/auth/password/forgot').send({ email: 'olvido@ejemplo.com' }).expect(202);
    await ctx.http().post('/auth/password/reset').send({ token: primero, password: 'nueva-5678' }).expect(410);
    await ctx.http().post('/auth/password/reset').send({ token: tokenDelUltimoCorreo(), password: 'nueva-5678' }).expect(200);
  });

  it('un enlace caducado (más de 1 hora) no sirve', async () => {
    await ctx.http().post('/auth/password/forgot').send({ email: 'olvido@ejemplo.com' }).expect(202);
    const token = tokenDelUltimoCorreo();
    await ctx.conn.collection('password_resets').updateMany({}, { $set: { expiresAt: new Date(Date.now() - 1000) } });
    await ctx.http().post('/auth/password/reset').send({ token, password: 'nueva-9999' }).expect(410);
  });

  it('tokens inventados o mal formados: 410; contraseña corta: 400', async () => {
    for (const token of ['x', 'abc.def', '000000000000000000000000.secreto']) {
      await ctx.http().post('/auth/password/reset').send({ token, password: 'nueva-1234' }).expect(410);
    }
    const r = await ctx.http().post('/auth/password/reset').send({ token: 'a.b', password: 'corta' }).expect(400);
    expect(r.body.fields.password).toEqual(expect.arrayContaining(['MIN_LENGTH']));
    await ctx.http().post('/auth/password/forgot').send({ email: 'no-es-correo' }).expect(400);
  });

  it('la sesión iniciada con la contraseña nueva sigue funcionando', async () => {
    const s = (await ctx.http().post('/auth/login').send({ email: 'olvido@ejemplo.com', password: 'nueva-5678' }).expect(200)).body;
    await ctx.http().get('/auth/me').set(bearer(s.accessToken)).expect(200);
  });
});
