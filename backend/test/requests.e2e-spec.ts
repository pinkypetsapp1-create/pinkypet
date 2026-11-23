import mongoose from 'mongoose';
import { runSeed } from '../src/seed/seed';
import { DEMO_ANSWERS } from '../src/seed/demo.data';
import { DEMO_PASSWORD, DEV_KEY, TestCtx, bearer, login, register, startApp } from './helpers';

async function userWithTest(ctx: TestCtx, email: string) {
  const s = await register(ctx, email);
  await ctx.http().put('/test/answers').set(bearer(s.accessToken)).send({ answers: DEMO_ANSWERS }).expect(200);
  return s;
}

describe('solicitudes de adopción', () => {
  let ctx: TestCtx;
  beforeAll(async () => (ctx = await startApp()));
  afterAll(() => ctx.close());

  it('TEST_REQUIRED: no se puede enviar sin haber hecho el test', async () => {
    const s = await login(ctx, 'registrada@ejemplo.com');
    const res = await ctx.http().post('/requests').set(bearer(s.accessToken)).send({ petId: 'luna' }).expect(403);
    expect(res.body.code).toBe('TEST_REQUIRED');
  });

  it('hace falta sesión', async () => {
    await ctx.http().post('/requests').send({ petId: 'luna' }).expect(401);
  });

  it('enviar, segunda → ACTIVE_REQUEST_EXISTS, sustituir y cancelar', async () => {
    const s = await userWithTest(ctx, 'flujo@correo.com');
    const h = bearer(s.accessToken);
    const r1 = (await ctx.http().post('/requests').set(h).send({ petId: 'luna' }).expect(201)).body;
    expect(r1).toMatchObject({ estado: 'en_proceso', mascota: { id: 'luna', compatibilidad: { porcentaje: 97 } } });

    const dup = await ctx.http().post('/requests').set(h).send({ petId: 'rocky' }).expect(409);
    expect(dup.body.code).toBe('ACTIVE_REQUEST_EXISTS');
    await ctx.http().post('/requests').set(h).send({ petId: 'luna', replaceActive: true }).expect(409);

    // «Continuar y cancelar la anterior»
    const r2 = (await ctx.http().post('/requests').set(h).send({ petId: 'rocky', replaceActive: true }).expect(201)).body;
    const cur = (await ctx.http().get('/requests/current').set(h).expect(200)).body;
    expect(cur.activa.id).toBe(r2.id);
    expect(cur.ultima.id).toBe(r2.id);
    const all = await ctx.conn.collection('adoption_requests').find({ userId: new mongoose.Types.ObjectId(s.user.id) }).toArray();
    expect(all.map((r) => [r.petSlug, r.estado]).sort()).toEqual([['luna', 'cancelada'], ['rocky', 'en_proceso']]);

    // Cancelar con confirmación (la confirmación es de la interfaz): la mascota sigue disponible.
    const c = (await ctx.http().post(`/requests/${r2.id}/cancel`).set(h).expect(200)).body;
    expect(c.estado).toBe('cancelada');
    const again = await ctx.http().post(`/requests/${r2.id}/cancel`).set(h).expect(409);
    expect(again.body.code).toBe('REQUEST_NOT_CANCELLABLE');
    expect((await ctx.http().get('/pets/rocky').expect(200)).body.disponible).toBe(true);
    const cur2 = (await ctx.http().get('/requests/current').set(h).expect(200)).body;
    expect(cur2.activa).toBeNull();
    expect(cur2.ultima.estado).toBe('cancelada');
    // Tras cancelar ya se puede enviar otra.
    await ctx.http().post('/requests').set(h).send({ petId: 'kira' }).expect(201);
  });

  it('no se puede cancelar la solicitud de otra persona', async () => {
    const a = await userWithTest(ctx, 'propietaria@correo.com');
    const b = await userWithTest(ctx, 'intrusa@correo.com');
    const r = (await ctx.http().post('/requests').set(bearer(a.accessToken)).send({ petId: 'coco' }).expect(201)).body;
    const res = await ctx.http().post(`/requests/${r.id}/cancel`).set(bearer(b.accessToken)).expect(404);
    expect(res.body.code).toBe('REQUEST_NOT_FOUND');
  });

  it('envíos simultáneos: solo uno queda en proceso', async () => {
    const s = await userWithTest(ctx, 'simultaneo@correo.com');
    const pets = ['luna', 'simba', 'rocky', 'kira', 'coco', 'nube'];
    const results = await Promise.all(pets.map((petId) => ctx.http().post('/requests').set(bearer(s.accessToken)).send({ petId })));
    expect(results.filter((r) => r.status === 201)).toHaveLength(1);
    expect(results.filter((r) => r.status === 409).every((r) => r.body.code === 'ACTIVE_REQUEST_EXISTS')).toBe(true);
    const active = await ctx.conn.collection('adoption_requests').countDocuments({ userId: new mongoose.Types.ObjectId(s.user.id), estado: 'en_proceso' });
    expect(active).toBe(1);
  });

  it('el índice de la base de datos impide dos solicitudes activas aunque se salte la API', async () => {
    const userId = new mongoose.Types.ObjectId();
    const col = ctx.conn.collection('adoption_requests');
    await col.insertOne({ userId, petSlug: 'luna', estado: 'en_proceso' });
    await expect(col.insertOne({ userId, petSlug: 'nube', estado: 'en_proceso' })).rejects.toMatchObject({ code: 11000 });
    await col.insertOne({ userId, petSlug: 'nube', estado: 'cancelada' }); // las cerradas no cuentan
  });

  it('cuenta demo con solicitud: Luna en proceso', async () => {
    const s = await login(ctx, 'solicitud@ejemplo.com');
    const cur = (await ctx.http().get('/requests/current').set(bearer(s.accessToken)).expect(200)).body;
    expect(cur.activa).toMatchObject({ estado: 'en_proceso', mascota: { id: 'luna' } });
  });

  describe('simulación de la protectora (solo desarrollo)', () => {
    it('sin la clave correcta el endpoint no existe', async () => {
      await ctx.http().post('/dev/requests/000000000000000000000000/resolve').send({ resultado: 'finalizada' }).expect(404);
      await ctx.http().post('/dev/requests/000000000000000000000000/resolve').set('X-Dev-Key', 'mala').send({ resultado: 'finalizada' }).expect(404);
    });

    it('finalizada: la mascota deja de estar disponible', async () => {
      const s = await userWithTest(ctx, 'adopta@correo.com');
      const r = (await ctx.http().post('/requests').set(bearer(s.accessToken)).send({ petId: 'nube' }).expect(201)).body;
      const res = await ctx.http().post(`/dev/requests/${r.id}/resolve`).set('X-Dev-Key', DEV_KEY).send({ resultado: 'finalizada' }).expect(200);
      expect(res.body.estado).toBe('finalizada');
      expect((await ctx.http().get('/requests/current').set(bearer(s.accessToken))).body).toMatchObject({ activa: null, ultima: { estado: 'finalizada' } });
      expect((await ctx.http().get('/pets').expect(200)).body.items.map((p: { id: string }) => p.id)).not.toContain('nube');
      const otra = await userWithTest(ctx, 'llega-tarde@correo.com');
      const no = await ctx.http().post('/requests').set(bearer(otra.accessToken)).send({ petId: 'nube' }).expect(409);
      expect(no.body.code).toBe('PET_NOT_AVAILABLE');
    });

    it('resultado no válido → VALIDATION_FAILED', async () => {
      const res = await ctx.http().post('/dev/requests/000000000000000000000000/resolve').set('X-Dev-Key', DEV_KEY).send({ resultado: 'quizá' }).expect(400);
      expect(res.body.code).toBe('VALIDATION_FAILED');
    });
  });

  it('el seed es idempotente y restablece la demo', async () => {
    const count = async () => ({
      pets: await ctx.conn.collection('pets').countDocuments(),
      questions: await ctx.conn.collection('questions').countDocuments(),
      demo: await ctx.conn.collection('users').countDocuments({ email: /@ejemplo\.com$/ }),
    });
    await runSeed(ctx.conn, DEMO_PASSWORD);
    const first = await count();
    await runSeed(ctx.conn, DEMO_PASSWORD);
    expect(await count()).toEqual(first);
    expect(first).toEqual({ pets: 6, questions: 15, demo: 3 });
    expect((await ctx.http().get('/pets').expect(200)).body.total).toBe(6); // Nube vuelve a estar disponible
  });
});

describe('producción', () => {
  let ctx: TestCtx;
  beforeAll(async () => (ctx = await startApp({ NODE_ENV: 'production' })));
  afterAll(() => ctx.close());

  it('el simulador no existe aunque se envíe la clave', async () => {
    const s = await login(ctx, 'solicitud@ejemplo.com');
    const cur = (await ctx.http().get('/requests/current').set(bearer(s.accessToken))).body;
    await ctx.http().post(`/dev/requests/${cur.activa.id}/resolve`).set('X-Dev-Key', DEV_KEY).send({ resultado: 'finalizada' }).expect(404);
    expect(ctx.env.devKey).toBeNull();
  });
});
