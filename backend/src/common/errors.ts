import { HttpStatus } from '@nestjs/common';

// Códigos estables que la app traduce a los textos del diseño (docs/SPEC.md §8).
export const ErrorCode = {
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
  REFRESH_INVALID: 'REFRESH_INVALID',
  EMAIL_ALREADY_REGISTERED: 'EMAIL_ALREADY_REGISTERED',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  TEST_REQUIRED: 'TEST_REQUIRED',
  ACTIVE_REQUEST_EXISTS: 'ACTIVE_REQUEST_EXISTS',
  REQUEST_NOT_FOUND: 'REQUEST_NOT_FOUND',
  REQUEST_NOT_CANCELLABLE: 'REQUEST_NOT_CANCELLABLE',
  PET_NOT_FOUND: 'PET_NOT_FOUND',
  PET_NOT_AVAILABLE: 'PET_NOT_AVAILABLE',
  TOO_MANY_ATTEMPTS: 'TOO_MANY_ATTEMPTS',
  GOOGLE_TOKEN_INVALID: 'GOOGLE_TOKEN_INVALID',
  GOOGLE_NOT_CONFIGURED: 'GOOGLE_NOT_CONFIGURED',
  RESET_TOKEN_INVALID: 'RESET_TOKEN_INVALID',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;
export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

/** Campo → lista de problemas (por ejemplo, { email: ['FORMAT'] } o { q4: ['REQUIRED'] }). */
export type FieldErrors = Record<string, string[]>;

export class AppError extends Error {
  constructor(
    readonly code: ErrorCode,
    readonly status: HttpStatus,
    message: string,
    readonly fields?: FieldErrors,
  ) {
    super(message);
  }
}

export const Errors = {
  invalidCredentials: () =>
    new AppError(ErrorCode.AUTH_INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED, 'Correo o contraseña incorrectos'),
  unauthorized: () => new AppError(ErrorCode.AUTH_UNAUTHORIZED, HttpStatus.UNAUTHORIZED, 'Hace falta iniciar sesión'),
  refreshInvalid: () =>
    new AppError(ErrorCode.REFRESH_INVALID, HttpStatus.UNAUTHORIZED, 'La sesión ha caducado o se ha cerrado'),
  emailTaken: () =>
    new AppError(ErrorCode.EMAIL_ALREADY_REGISTERED, HttpStatus.CONFLICT, 'Ya existe una cuenta con este correo', {
      email: ['TAKEN'],
    }),
  validation: (fields: FieldErrors) =>
    new AppError(ErrorCode.VALIDATION_FAILED, HttpStatus.BAD_REQUEST, 'Hay campos no válidos', fields),
  testRequired: () =>
    new AppError(ErrorCode.TEST_REQUIRED, HttpStatus.FORBIDDEN, 'Hace falta responder el test de compatibilidad'),
  activeRequestExists: () =>
    new AppError(ErrorCode.ACTIVE_REQUEST_EXISTS, HttpStatus.CONFLICT, 'Ya tienes una solicitud de adopción en proceso'),
  requestNotFound: () =>
    new AppError(ErrorCode.REQUEST_NOT_FOUND, HttpStatus.NOT_FOUND, 'No se ha encontrado la solicitud'),
  requestNotCancellable: () =>
    new AppError(ErrorCode.REQUEST_NOT_CANCELLABLE, HttpStatus.CONFLICT, 'Esta solicitud ya no está en proceso'),
  petNotFound: () => new AppError(ErrorCode.PET_NOT_FOUND, HttpStatus.NOT_FOUND, 'No se ha encontrado la mascota'),
  googleInvalid: () =>
    new AppError(ErrorCode.GOOGLE_TOKEN_INVALID, HttpStatus.UNAUTHORIZED, 'No se ha podido verificar la cuenta de Google'),
  googleNotConfigured: () =>
    new AppError(ErrorCode.GOOGLE_NOT_CONFIGURED, HttpStatus.SERVICE_UNAVAILABLE, 'El inicio de sesión con Google no está configurado'),
  resetTokenInvalid: () =>
    new AppError(ErrorCode.RESET_TOKEN_INVALID, HttpStatus.GONE, 'El enlace ha caducado o ya se ha usado'),
  petNotAvailable: () =>
    new AppError(ErrorCode.PET_NOT_AVAILABLE, HttpStatus.CONFLICT, 'Esta mascota ya no está disponible'),
};
