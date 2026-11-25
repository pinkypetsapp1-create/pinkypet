import { DEMO_ANSWERS } from '../src/seed/demo.data';
import { PETS } from '../src/seed/pets.data';

// Las seis mascotas originales del diseño; las añadidas con /nueva-mascota se comprueban a partir de PETS.
const ORIGINALES = ['luna', 'simba', 'rocky', 'kira', 'coco', 'nube'];
const slugs = (f: (p: (typeof PETS)[number]) => boolean) => PETS.filter(f).map((p) => p.slug);
import { TestCtx, bearer, login, register, startApp } from './helpers';

describe('test y compatibilidad', () => {
  let ctx: TestCtx;
  beforeAll(async () => (ctx = await startApp()));
  afterAll(() => ctx.close());

  it('GET /test/questions: 15 preguntas en 3 bloques', async () => {
    const res = await ctx.http().get('/test/questions').expect(200);
    expect(res.body.preguntas).toHaveLength(15);
    expect(res.body.bloques.map((b: { titulo: string }) => b.titulo)).toEqual(['Mi hogar', 'Mi día a día', 'La mascota que busco']);
    expect(res.body.preguntas.filter((q: { consejo?: string }) => q.consejo).map((q: { id: string }) => q.id)).toEqual(['q3', 'q6', 'q14']);
  });

  it('cuenta demo: orden del diseño y % calculados desde sus respuestas', async () => {
    const s = await login(ctx, 'persona@ejemplo.com');
    const res = await ctx.http().get('/compatibility').set(bearer(s.accessToken)).expect(200);
    const items = res.body.items.map((p: { id: string; compatibilidad: { porcentaje: number } }) => [p.id, p.compatibilidad.porcentaje]);
    expect(items).toHaveLength(PETS.length);
    expect(items.filter(([id]: [string]) => ORIGINALES.includes(id))).toEqual([
      ['luna', 97], ['coco', 95], ['simba', 87], ['kira', 82], ['nube', 70], ['rocky', 54],
    ]);
    expect(res.body).toMatchObject({ sinCompatibles: false, umbral: 50 });
  });

  it('TEST_REQUIRED si aún no ha hecho el test', async () => {
    const s = await login(ctx, 'registrada@ejemplo.com');
    const res = await ctx.http().get('/compatibility').set(bearer(s.accessToken)).expect(403);
    expect(res.body.code).toBe('TEST_REQUIRED');
  });

  it('VALIDATION_FAILED con las preguntas sin responder (Test-Error)', async () => {
    const s = await register(ctx, 'test-incompleto@correo.com');
    const { q4: _a, q9: _b, ...parcial } = DEMO_ANSWERS;
    const res = await ctx.http().put('/test/answers').set(bearer(s.accessToken)).send({ answers: parcial }).expect(400);
    expect(res.body).toMatchObject({ code: 'VALIDATION_FAILED', fields: { q4: ['REQUIRED'], q9: ['REQUIRED'] } });
  });

  it('modificar las respuestas recalcula el %', async () => {
    const s = await register(ctx, 'cambia@correo.com');
    await ctx.http().put('/test/answers').set(bearer(s.accessToken)).send({ answers: DEMO_ANSWERS }).expect(200);
    const antes = (await ctx.http().get('/pets/rocky').set(bearer(s.accessToken)).expect(200)).body.compatibilidad.porcentaje;
    const nuevas = { ...DEMO_ANSWERS, q4: 'Casa con jardín', q6: 'Menos de 4 horas', q7: 'Más de 2 horas', q9: 'Muy activo', q11: 'Grande', q12: 'Alto', q14: 'Más de 100 €' };
    await ctx.http().put('/test/answers').set(bearer(s.accessToken)).send({ answers: nuevas }).expect(200);
    const despues = (await ctx.http().get('/pets/rocky').set(bearer(s.accessToken)).expect(200)).body.compatibilidad.porcentaje;
    expect([antes, despues]).toEqual([54, 100]);
    const saved = (await ctx.http().get('/test/answers').set(bearer(s.accessToken)).expect(200)).body;
    expect(saved.answers.q4).toBe('Casa con jardín');
  });

  it('sinCompatibles cuando ninguna llega al 50 %', async () => {
    const s = await register(ctx, 'sin-compatibles@correo.com');
    const lejos = {
      q1: 'Sí', q2: 'Sí, otras mascotas', q3: 'No', q4: 'Piso sin terraza', q5: 'No lo sé',
      q6: 'Más de 8 horas', q7: 'Menos de 1 hora', q8: 'No lo sé todavía', q9: 'Muy activo', q10: 'Nunca',
      q11: 'Grande', q12: 'Alto', q13: 'Cachorro', q14: 'Menos de 50 €', q15: 'No',
    };
    await ctx.http().put('/test/answers').set(bearer(s.accessToken)).send({ answers: lejos }).expect(200);
    const res = await ctx.http().get('/compatibility').set(bearer(s.accessToken)).expect(200);
    expect(res.body).toMatchObject({ items: [], sinCompatibles: true });
  });

  describe('catálogo', () => {
    it('sin sesión: sin %, en el orden del catálogo', async () => {
      const res = await ctx.http().get('/pets').expect(200);
      expect(res.body.total).toBe(PETS.length);
      expect(res.body.items.map((p: { id: string }) => p.id)).toEqual(PETS.map((p) => p.slug));
      expect(res.body.items[0].compatibilidad).toBeUndefined();
      expect(res.body.items[0]).not.toHaveProperty('atributos');
    });

    it('filtros: tipo, necesidades especiales y provincia', async () => {
      const ids = async (q: string) => (await ctx.http().get(`/pets${q}`).expect(200)).body.items.map((p: { id: string }) => p.id);
      expect(await ids('?tipo=gato')).toEqual(slugs((p) => p.tipo === 'gato'));
      expect(await ids('?tipo=perro,otros')).toEqual(slugs((p) => p.tipo !== 'gato'));
      expect(await ids('?ne=true')).toEqual(slugs((p) => p.necesidadesEspeciales));
      expect(await ids('?tipo=gato&ne=true')).toEqual(slugs((p) => p.tipo === 'gato' && p.necesidadesEspeciales));
      expect(await ids('?provincia=Barcelona')).toEqual(slugs((p) => p.provincia === 'Barcelona'));
      expect((await ids('?provincia=Barcelona')).filter((s: string) => ORIGINALES.includes(s))).toEqual(ORIGINALES);
      expect(await ids('?provincia=Madrid')).toEqual([]);
    });

    it('filtro no válido → VALIDATION_FAILED', async () => {
      const res = await ctx.http().get('/pets?tipo=dragon').expect(400);
      expect(res.body.code).toBe('VALIDATION_FAILED');
    });

    it('ficha con los textos literales; con test incluye los bloques', async () => {
      const anon = (await ctx.http().get('/pets/luna').expect(200)).body;
      expect(anon.encaja).toBe('Busca un hogar tranquilo y una rutina estable.');
      expect(anon.info.historia).toBe('Rescatada en la calle.');
      expect(anon.foto).toEqual({ asset: 'fotos/luna.jpg', alt: 'Luna, gata gris y blanca, sentada junto a un muro de piedra y unas flores' });
      const s = await login(ctx, 'persona@ejemplo.com');
      const conTest = (await ctx.http().get('/pets/luna').set(bearer(s.accessToken)).expect(200)).body;
      expect(conTest.compatibilidad).toEqual({ porcentaje: 97, bloques: { hogar: 100, diaADia: 100, mascota: 90 }, compatible: true });
    });

    it('PET_NOT_FOUND', async () => {
      const res = await ctx.http().get('/pets/dragon').expect(404);
      expect(res.body.code).toBe('PET_NOT_FOUND');
    });
  });
});
