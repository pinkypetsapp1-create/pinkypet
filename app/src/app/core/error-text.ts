// Códigos de error de la API → textos literales del diseño (design/alta-fidelidad).
// Los que dependen del campo están junto al formulario (Registro, Login, Test).
export const TEXTOS = {
  emailFormato: 'Escribe un correo completo, por ejemplo nombre@correo.com.',
  passMin: 'La contraseña debe tener al menos 8 caracteres.',
  passMinAhora: (n: number) => `La contraseña debe tener al menos 8 caracteres. Ahora tiene ${n}.`,
  passVacia: 'Escribe tu contraseña.',
  loginIncorrecto: 'El correo o la contraseña no son correctos. Revísalos e inténtalo de nuevo.',
  loginReescribe: 'Por seguridad, vuelve a escribir tu contraseña.',
  correoExiste: 'Ya existe una cuenta con este correo.',
  resumenRegistro: (n: number) => (n === 2 ? 'Revisa los 2 campos marcados para crear tu cuenta.' : 'Revisa el campo marcado para crear tu cuenta.'),
  resumenLogin: (n: number) => (n === 2 ? 'Revisa los 2 campos marcados para iniciar sesión.' : 'Revisa el campo marcado para iniciar sesión.'),
  preguntaSinResponder: 'Responde esta pregunta para continuar.',
};

/** Misma comprobación de correo que el diseño y el backend. */
export const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
