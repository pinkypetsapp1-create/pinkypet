// Las 15 preguntas del test, con textos literales de design/alta-fidelidad/Test.dc.html.
// Las opciones se guardan como su texto literal: es lo que la persona marca y lo que muestra «Mi perfil».

export type BlockId = 'hogar' | 'diaADia' | 'mascota';
export type QuestionId = `q${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15}`;

export interface QuestionDef {
  id: QuestionId;
  numero: number;
  bloque: BlockId;
  texto: string;
  /** Etiqueta corta que usa «Mi perfil · completado». */
  resumen: string;
  opciones: readonly string[];
  consejo?: string;
}

export const BLOCKS: readonly { id: BlockId; titulo: string; peso: number }[] = [
  { id: 'hogar', titulo: 'Mi hogar', peso: 0.34 },
  { id: 'diaADia', titulo: 'Mi día a día', peso: 0.33 },
  { id: 'mascota', titulo: 'La mascota que busco', peso: 0.33 },
];

export const QUESTIONS: readonly QuestionDef[] = [
  { id: 'q1', numero: 1, bloque: 'hogar', texto: '¿Hay niños pequeños en casa?', resumen: 'Niños pequeños en casa', opciones: ['Sí', 'No'] },
  { id: 'q2', numero: 2, bloque: 'hogar', texto: '¿Hay otras mascotas en casa?', resumen: 'Otras mascotas en casa', opciones: ['No', 'Sí, perros o gatos', 'Sí, otras mascotas'] },
  {
    id: 'q3', numero: 3, bloque: 'hogar', texto: '¿Todas las personas con las que vives están de acuerdo con la adopción?', resumen: 'Acuerdo de las personas convivientes',
    opciones: ['Sí', 'No', 'Vivo sola o solo'],
    consejo: 'Adoptar es una decisión de todo el hogar. Si alguien no está de acuerdo, habla antes con esa persona: la mascota va a convivir con todas, no solo contigo.',
  },
  { id: 'q4', numero: 4, bloque: 'hogar', texto: '¿En qué tipo de vivienda vives?', resumen: 'Vivienda', opciones: ['Piso sin terraza', 'Piso con terraza o balcón', 'Casa con jardín'] },
  { id: 'q5', numero: 5, bloque: 'hogar', texto: '¿Tu vivienda permite tener mascotas?', resumen: 'Permite mascotas', opciones: ['Sí, es propia', 'Sí, el alquiler lo permite', 'No lo sé'] },
  {
    id: 'q6', numero: 6, bloque: 'diaADia', texto: '¿Cuánto tiempo estaría solo la mascota en casa?', resumen: 'Tiempo solo en casa',
    opciones: ['Menos de 4 horas', 'Entre 4 y 8 horas', 'Más de 8 horas'],
    consejo: 'Ninguna mascota debería pasar muchas horas solo cada día. Si vas a estar fuera más de 8 horas, valora una mascota más independiente o busca a alguien que pueda acompañarlo o sacarlo durante el día.',
  },
  { id: 'q7', numero: 7, bloque: 'diaADia', texto: '¿Cuánto tiempo al día puedes dedicarle?', resumen: 'Tiempo al día para dedicarle', opciones: ['Menos de 1 hora', 'Entre 1 y 2 horas', 'Más de 2 horas'] },
  { id: 'q8', numero: 8, bloque: 'diaADia', texto: 'Si viajas o enfermas, ¿quién cuidaría de la mascota?', resumen: 'Quién lo cuidaría', opciones: ['Alguien de mi casa', 'Familia o amistades', 'No lo sé todavía'] },
  { id: 'q9', numero: 9, bloque: 'diaADia', texto: '¿Cómo es tu ritmo de vida?', resumen: 'Ritmo de vida', opciones: ['Tranquilo', 'Moderado', 'Muy activo'] },
  { id: 'q10', numero: 10, bloque: 'diaADia', texto: '¿Has tenido mascotas antes?', resumen: 'Mascotas antes', opciones: ['Nunca', 'Sí, en casa familiar', 'Sí, bajo mi responsabilidad'] },
  { id: 'q11', numero: 11, bloque: 'mascota', texto: '¿De qué tamaño buscas a la mascota?', resumen: 'Tamaño', opciones: ['Pequeño', 'Mediano', 'Grande'] },
  { id: 'q12', numero: 12, bloque: 'mascota', texto: '¿Qué nivel de actividad buscas en la mascota?', resumen: 'Nivel de actividad', opciones: ['Bajo', 'Medio', 'Alto'] },
  { id: 'q13', numero: 13, bloque: 'mascota', texto: '¿Qué edad prefieres?', resumen: 'Edad', opciones: ['Cachorro', 'Adulto', 'Mayor', 'Me da igual'] },
  {
    id: 'q14', numero: 14, bloque: 'mascota', texto: '¿Cuánto puedes dedicar cada mes a sus cuidados (comida, veterinario…)?', resumen: 'Gasto mensual en sus cuidados',
    opciones: ['Menos de 50 €', 'Entre 50 y 100 €', 'Más de 100 €'],
    consejo: 'Además de la comida, cuenta el veterinario, las vacunas y los imprevistos. Calcula una cifra que puedas mantener todos los meses, no solo el primero.',
  },
  { id: 'q15', numero: 15, bloque: 'mascota', texto: '¿Adoptarías una mascota con necesidades especiales?', resumen: 'Necesidades especiales', opciones: ['Sí', 'Depende de sus necesidades', 'No'] },
];

export const QUESTION_IDS = QUESTIONS.map((q) => q.id);
export type Answers = Record<QuestionId, string>;

/** Devuelve { qN: [código] } con las preguntas sin responder o con una opción que no existe. */
export function validateAnswers(input: Record<string, unknown>): Record<string, string[]> {
  const fields: Record<string, string[]> = {};
  for (const q of QUESTIONS) {
    const v = input[q.id];
    if (v === undefined || v === null || v === '') fields[q.id] = ['REQUIRED'];
    else if (typeof v !== 'string' || !q.opciones.includes(v)) fields[q.id] = ['INVALID_OPTION'];
  }
  for (const key of Object.keys(input)) if (!QUESTION_IDS.includes(key as QuestionId)) fields[key] = ['UNKNOWN_QUESTION'];
  return fields;
}
