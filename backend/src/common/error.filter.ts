import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import type { Response } from 'express';
import { AppError, ErrorCode } from './errors';

/** Respuesta de error de toda la API: { code, message, fields? }. */
export interface ErrorBody {
  code: ErrorCode;
  message: string;
  fields?: Record<string, string[]>;
}

@Catch()
export class ErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger('Error');

  catch(exception: unknown, host: ArgumentsHost): void {
    const res = host.switchToHttp().getResponse<Response>();
    const [status, body] = this.toBody(exception);
    if (status >= 500) this.logger.error(exception instanceof Error ? exception.stack : String(exception));
    res.status(status).json(body);
  }

  private toBody(e: unknown): [number, ErrorBody] {
    if (e instanceof AppError) {
      return [e.status, { code: e.code, message: e.message, ...(e.fields ? { fields: e.fields } : {}) }];
    }
    if (e instanceof ThrottlerException) {
      return [HttpStatus.TOO_MANY_REQUESTS, { code: ErrorCode.TOO_MANY_ATTEMPTS, message: 'Demasiados intentos. Espera un momento.' }];
    }
    if (e instanceof HttpException) {
      const status = e.getStatus();
      if (status === HttpStatus.UNAUTHORIZED) return [status, { code: ErrorCode.AUTH_UNAUTHORIZED, message: 'Hace falta iniciar sesión' }];
      if (status === HttpStatus.NOT_FOUND) return [status, { code: ErrorCode.NOT_FOUND, message: 'No encontrado' }];
      if (status === HttpStatus.BAD_REQUEST) return [status, { code: ErrorCode.VALIDATION_FAILED, message: 'Petición no válida' }];
      return [status, { code: ErrorCode.INTERNAL_ERROR, message: e.message }];
    }
    return [HttpStatus.INTERNAL_SERVER_ERROR, { code: ErrorCode.INTERNAL_ERROR, message: 'Error interno' }];
  }
}
