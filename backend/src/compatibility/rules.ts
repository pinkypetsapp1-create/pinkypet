// Cálculo de compatibilidad · SIMULACIÓN ACADÉMICA, no validada (docs/SPEC.md §4.4 y §8).
//
// Cada pregunta compara la respuesta de la persona con un atributo de la mascota y da un nivel de encaje.
// Cada nivel resta puntos al bloque, que empieza en 100. El global combina los tres bloques con
// la fórmula del diseño: round(0,34·hogar + 0,33·día a día + 0,33·mascota).
// El % siempre sale de las respuestas de cada persona: no hay valores fijos por mascota.
import { Answers, BLOCKS, BlockId, QUESTIONS, QuestionId } from './questions';

export type Level = 'encaja' | 'leve' | 'parcial' | 'no_encaja';
export const PENALTY: Record<Level, number> = { encaja: 0, leve: 5, parcial: 15, no_encaja: 30 };
/** Por debajo de este %, la mascota no cuenta como compatible (decisión del equipo, 2026-11-23). */
export const COMPATIBLE_THRESHOLD = 50;

type Grade3 = 'bajo' | 'medio' | 'alto';
export interface PetAttributes {
  tamano: 'pequeno' | 'mediano' | 'grande';
  etapa: 'cachorro' | 'adulto' | 'mayor';
  actividad: Grade3;
  /** Vivienda mínima en la que está bien. */
  vivienda: 'piso' | 'piso_exterior' | 'casa_jardin';
  /** Horas que puede pasar sola cada día sin problema. */
  horasSolaMax: number;
  tiempoDiario: Grade3;
  convivenciaNinos: 'si' | 'no' | 'desconocido';
  convivenciaMascotas: 'si' | 'no' | 'desconocido' | 'prefiere_compania_especie';
  costeMensual: Grade3;
  necesidadesEspeciales: 'ninguna' | 'leves' | 'medias' | 'altas';
  experiencia: 'ninguna' | 'basica' | 'responsable';
}

const rank = { bajo: 0, medio: 1, alto: 2, pequeno: 0, mediano: 1, grande: 2 } as const;
/** 0 pasos de diferencia → encaja; 1 → parcial; 2 o más → no encaja. */
const byDistance = (d: number): Level => (d <= 0 ? 'encaja' : d === 1 ? 'parcial' : 'no_encaja');

type Rule = (pet: PetAttributes, answer: string) => Level;

export const RULES: Record<QuestionId, Rule> = {
  // Mi hogar
  q1: (p, a) => (a === 'No' ? 'encaja' : ({ si: 'encaja', desconocido: 'leve', no: 'no_encaja' } as const)[p.convivenciaNinos]),
  q2: (p, a) => {
    if (a === 'No') return p.convivenciaMascotas === 'prefiere_compania_especie' ? 'parcial' : 'encaja';
    return ({ si: 'encaja', desconocido: 'leve', prefiere_compania_especie: 'leve', no: 'no_encaja' } as const)[p.convivenciaMascotas];
  },
  q3: (_p, a) => (a === 'No' ? 'no_encaja' : 'encaja'),
  q4: (p, a) => {
    const tiene = { 'Piso sin terraza': 0, 'Piso con terraza o balcón': 1, 'Casa con jardín': 2 }[a] ?? 0;
    const necesita = { piso: 0, piso_exterior: 1, casa_jardin: 2 }[p.vivienda];
    return byDistance(necesita - tiene);
  },
  q5: (_p, a) => (a === 'No lo sé' ? 'parcial' : 'encaja'),
  // Mi día a día
  q6: (p, a) => {
    const horas = { 'Menos de 4 horas': 4, 'Entre 4 y 8 horas': 8, 'Más de 8 horas': 10 }[a] ?? 10;
    const exceso = horas - p.horasSolaMax;
    return exceso <= 0 ? 'encaja' : exceso <= 2 ? 'leve' : 'no_encaja';
  },
  q7: (p, a) => {
    const puede = { 'Menos de 1 hora': 0, 'Entre 1 y 2 horas': 1, 'Más de 2 horas': 2 }[a] ?? 0;
    return byDistance(rank[p.tiempoDiario] - puede);
  },
  q8: (_p, a) => (a === 'No lo sé todavía' ? 'parcial' : 'encaja'),
  q9: (p, a) => byDistance(Math.abs(({ Tranquilo: 0, Moderado: 1, 'Muy activo': 2 }[a] ?? 1) - rank[p.actividad])),
  q10: (p, a) => {
    const tiene = { Nunca: 0, 'Sí, en casa familiar': 1, 'Sí, bajo mi responsabilidad': 2 }[a] ?? 0;
    return tiene >= { ninguna: 0, basica: 1, responsable: 2 }[p.experiencia] ? 'encaja' : 'parcial';
  },
  // La mascota que busco
  q11: (p, a) => byDistance(Math.abs(({ Pequeño: 0, Mediano: 1, Grande: 2 }[a] ?? 0) - rank[p.tamano])),
  q12: (p, a) => {
    const d = Math.abs(({ Bajo: 0, Medio: 1, Alto: 2 }[a] ?? 1) - rank[p.actividad]);
    return d === 0 ? 'encaja' : d === 1 ? 'leve' : 'no_encaja';
  },
  q13: (p, a) => (a === 'Me da igual' || a.toLowerCase() === p.etapa ? 'encaja' : 'parcial'),
  q14: (p, a) => byDistance(rank[p.costeMensual] - ({ 'Menos de 50 €': 0, 'Entre 50 y 100 €': 1, 'Más de 100 €': 2 }[a] ?? 0)),
  q15: (p, a) => {
    if (p.necesidadesEspeciales === 'ninguna' || a === 'Sí') return 'encaja';
    if (a === 'No') return 'no_encaja';
    return ({ leves: 'leve', medias: 'parcial', altas: 'no_encaja' } as const)[p.necesidadesEspeciales];
  },
};

export interface CriterionResult {
  pregunta: QuestionId;
  bloque: BlockId;
  nivel: Level;
  penalizacion: number;
}
export interface CompatibilityResult {
  porcentaje: number;
  bloques: Record<BlockId, number>;
  compatible: boolean;
  detalle: CriterionResult[];
}

export function computeCompatibility(pet: PetAttributes, answers: Answers): CompatibilityResult {
  const detalle: CriterionResult[] = QUESTIONS.map((q) => {
    const nivel = RULES[q.id](pet, answers[q.id]);
    return { pregunta: q.id, bloque: q.bloque, nivel, penalizacion: PENALTY[nivel] };
  });
  const bloques = Object.fromEntries(
    BLOCKS.map((b) => [
      b.id,
      Math.max(0, 100 - detalle.filter((c) => c.bloque === b.id).reduce((s, c) => s + c.penalizacion, 0)),
    ]),
  ) as Record<BlockId, number>;
  const porcentaje = globalPercent(bloques);
  return { porcentaje, bloques, compatible: porcentaje >= COMPATIBLE_THRESHOLD, detalle };
}

/** Fórmula del diseño. Se redondea una sola vez, al final. */
export function globalPercent(b: Record<BlockId, number>): number {
  return Math.round(BLOCKS.reduce((s, blk) => s + blk.peso * b[blk.id], 0));
}
