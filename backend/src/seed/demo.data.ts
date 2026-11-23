import type { Answers } from '../compatibility/questions';

// Respuestas de «Mi perfil · completado» (design/alta-fidelidad/Test.dc.html, initialAnswers).
export const DEMO_ANSWERS: Answers = {
  q1: 'No', q2: 'No', q3: 'Vivo sola o solo', q4: 'Piso con terraza o balcón', q5: 'Sí, el alquiler lo permite',
  q6: 'Entre 4 y 8 horas', q7: 'Entre 1 y 2 horas', q8: 'Familia o amistades', q9: 'Tranquilo', q10: 'Sí, en casa familiar',
  q11: 'Pequeño', q12: 'Medio', q13: 'Me da igual', q14: 'Entre 50 y 100 €', q15: 'Depende de sus necesidades',
};

// Cuentas ficticias (dominio reservado ejemplo.com). La contraseña sale de SEED_DEMO_PASSWORD.
export const DEMO_ACCOUNTS = {
  conTest: 'persona@ejemplo.com',
  sinTest: 'registrada@ejemplo.com',
  conSolicitud: 'solicitud@ejemplo.com',
} as const;
