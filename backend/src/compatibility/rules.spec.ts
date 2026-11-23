import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { PETS } from '../seed/pets.data';
import { DEMO_ANSWERS } from '../seed/demo.data';
import { Answers, QUESTIONS, validateAnswers } from './questions';
import { COMPATIBLE_THRESHOLD, PetAttributes, RULES, computeCompatibility, globalPercent } from './rules';

const pet = (slug: string) => PETS.find((p) => p.slug === slug)!;
const DESIGN = join(__dirname, '../../../design/alta-fidelidad');

describe('fórmula del % global', () => {
  it('cuadra con los seis valores del diseño', () => {
    const design: [number, number, number, number][] = [
      [95, 90, 90, 92], [85, 75, 83, 81], [55, 70, 67, 64], [80, 75, 73, 76], [90, 85, 80, 85], [75, 70, 65, 70],
    ];
    for (const [hogar, diaADia, mascota, global] of design) {
      expect(globalPercent({ hogar, diaADia, mascota })).toBe(global);
    }
  });
});

describe('cuenta demo (persona@ejemplo.com)', () => {
  const results = PETS.map((p) => ({ slug: p.slug, ...computeCompatibility(p.atributos, DEMO_ANSWERS) })).sort(
    (a, b) => b.porcentaje - a.porcentaje,
  );

  it('ordena las mascotas igual que el diseño', () => {
    expect(results.map((r) => r.slug)).toEqual(['luna', 'coco', 'simba', 'kira', 'nube', 'rocky']);
  });

  it('da los % calculados documentados en SPEC', () => {
    expect(Object.fromEntries(results.map((r) => [r.slug, r.porcentaje]))).toEqual({
      luna: 97, coco: 95, simba: 87, kira: 82, nube: 70, rocky: 54,
    });
  });

  it('las seis son compatibles con el umbral del 50 %', () => {
    expect(results.every((r) => r.compatible)).toBe(true);
  });
});

describe('el % refleja las respuestas', () => {
  const base = DEMO_ANSWERS;

  it('cambia si cambian las respuestas', () => {
    const casa: Answers = { ...base, q4: 'Casa con jardín', q6: 'Menos de 4 horas', q7: 'Más de 2 horas', q9: 'Muy activo', q11: 'Grande', q12: 'Alto', q14: 'Más de 100 €' };
    const antes = computeCompatibility(pet('rocky').atributos, base).porcentaje;
    const despues = computeCompatibility(pet('rocky').atributos, casa).porcentaje;
    expect(despues).toBeGreaterThan(antes);
    expect(despues).toBe(100);
  });

  it('un bloque nunca baja de 0', () => {
    const peor: Answers = { ...base, q1: 'Sí', q2: 'Sí, perros o gatos', q3: 'No', q4: 'Piso sin terraza', q5: 'No lo sé' };
    const r = computeCompatibility(pet('rocky').atributos, peor);
    expect(r.bloques.hogar).toBeGreaterThanOrEqual(0);
  });

  it('marca como no compatible por debajo del umbral', () => {
    const lejos: Answers = {
      q1: 'Sí', q2: 'Sí, otras mascotas', q3: 'No', q4: 'Piso sin terraza', q5: 'No lo sé',
      q6: 'Más de 8 horas', q7: 'Menos de 1 hora', q8: 'No lo sé todavía', q9: 'Tranquilo', q10: 'Nunca',
      q11: 'Pequeño', q12: 'Bajo', q13: 'Cachorro', q14: 'Menos de 50 €', q15: 'No',
    };
    const r = computeCompatibility(pet('rocky').atributos, lejos);
    expect(r.porcentaje).toBeLessThan(COMPATIBLE_THRESHOLD);
    expect(r.compatible).toBe(false);
  });
});

describe('reglas', () => {
  const attrs: PetAttributes = pet('luna').atributos;

  it('hay una regla por pregunta y acepta todas sus opciones', () => {
    for (const q of QUESTIONS) {
      for (const op of q.opciones) expect(['encaja', 'leve', 'parcial', 'no_encaja']).toContain(RULES[q.id](attrs, op));
    }
  });

  it('necesidades especiales: «No» descarta y «Depende» gradúa por intensidad', () => {
    expect(RULES.q15(pet('luna').atributos, 'No')).toBe('no_encaja');
    expect(RULES.q15(pet('luna').atributos, 'Depende de sus necesidades')).toBe('leve');
    expect(RULES.q15(pet('kira').atributos, 'Depende de sus necesidades')).toBe('parcial');
    expect(RULES.q15(pet('nube').atributos, 'Depende de sus necesidades')).toBe('no_encaja');
    expect(RULES.q15(pet('simba').atributos, 'No')).toBe('encaja');
  });

  it('vivienda: un perro grande que necesita jardín no encaja en piso sin terraza', () => {
    expect(RULES.q4(pet('rocky').atributos, 'Piso sin terraza')).toBe('no_encaja');
    expect(RULES.q4(pet('rocky').atributos, 'Casa con jardín')).toBe('encaja');
  });
});

describe('validación de respuestas', () => {
  it('pide las 15 y solo opciones existentes', () => {
    expect(validateAnswers(DEMO_ANSWERS)).toEqual({});
    const { q4: _omit, ...sinQ4 } = DEMO_ANSWERS;
    expect(validateAnswers({ ...sinQ4, q9: 'Frenético', q99: 'x' })).toEqual({
      q4: ['REQUIRED'], q9: ['INVALID_OPTION'], q99: ['UNKNOWN_QUESTION'],
    });
  });
});

describe('coherencia con el diseño (design/alta-fidelidad)', () => {
  it('los textos de las mascotas son los literales de Ficha.dc.html', () => {
    const src = readFileSync(join(DESIGN, 'Ficha.dc.html'), 'utf8');
    const start = src.indexOf('const D = {');
    const D = vm.runInNewContext(`(${src.slice(start + 10, src.indexOf('const FOTO', start)).trim().replace(/;$/, '')})`) as Record<
      string,
      { name: string; meta: string; ne: boolean; info: string[]; encaja: string; cuenta: string }
    >;
    expect(Object.keys(D)).toEqual(PETS.map((p) => p.slug));
    for (const p of PETS) {
      const d = D[p.slug];
      expect(p.nombre).toBe(d.name);
      expect([p.especie, p.sexo, p.edad, p.ciudad, p.tamano].join(' · ')).toBe(d.meta);
      expect(p.necesidadesEspeciales).toBe(d.ne);
      expect(Object.values(p.info)).toEqual(d.info);
      expect(p.encaja).toBe(d.encaja);
      expect(p.cuenta).toBe(d.cuenta);
      expect(src).toContain(p.foto.alt);
    }
  });

  it('las preguntas y opciones son las literales de Test.dc.html', () => {
    const src = readFileSync(join(DESIGN, 'Test.dc.html'), 'utf8');
    for (const q of QUESTIONS) {
      expect(src).toContain(`q(${q.numero}, '${q.texto}', [${q.opciones.map((o) => `'${o}'`).join(', ')}]`);
      if (q.consejo) expect(src).toContain(q.consejo);
    }
  });

  it('las respuestas demo son las del test ya respondido del diseño', () => {
    const src = readFileSync(join(DESIGN, 'Test.dc.html'), 'utf8');
    for (const [id, v] of Object.entries(DEMO_ANSWERS)) expect(src).toContain(`${id}: '${v}'`);
  });
});
