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
  pass2Vacia: 'Repite la contraseña.',
  passNoCoinciden: 'Las contraseñas no coinciden.',
  resumenRegistro: (n: number) => (n === 1 ? 'Revisa el campo marcado para crear tu cuenta.' : `Revisa los ${n} campos marcados para crear tu cuenta.`),
  resumenNuevaContrasena: (n: number) =>
    n === 2 ? 'Revisa los 2 campos marcados para guardar tu contraseña.' : 'Revisa el campo marcado para guardar tu contraseña.',
  resumenLogin: (n: number) => (n === 2 ? 'Revisa los 2 campos marcados para iniciar sesión.' : 'Revisa el campo marcado para iniciar sesión.'),
  /** Mismas reglas que Registro y NuevaContrasena.dc.html. */
  pass2Error: (pass: string, pass2: string): string | null =>
    pass2.length === 0 ? 'Repite la contraseña.' : pass2 !== pass ? 'Las contraseñas no coinciden.' : null,
  passError: (pass: string): string | null =>
    pass.length >= 8 ? null : pass.length === 0 ? 'La contraseña debe tener al menos 8 caracteres.' : `La contraseña debe tener al menos 8 caracteres. Ahora tiene ${pass.length}.`,
  preguntaSinResponder: 'Responde esta pregunta para continuar.',
};

/** Misma comprobación de correo que el diseño y el backend. */
export const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
