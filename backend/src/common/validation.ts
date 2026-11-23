import { ValidationError, ValidationPipe } from '@nestjs/common';
import { Errors, FieldErrors } from './errors';

// Traduce los errores de class-validator a { campo: [CÓDIGO] }.
// El código de cada regla se pone en el decorador con `context: { code: '…' }`.
function collect(errors: ValidationError[], prefix = '', out: FieldErrors = {}): FieldErrors {
  for (const err of errors) {
    const key = prefix ? `${prefix}.${err.property}` : err.property;
    if (err.constraints) {
      out[key] = Object.keys(err.constraints).map(
        (rule) => (err.contexts?.[rule] as { code?: string } | undefined)?.code ?? rule.toUpperCase(),
      );
    }
    if (err.children?.length) collect(err.children, key, out);
  }
  return out;
}

export const validationPipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  exceptionFactory: (errors) => Errors.validation(collect(errors)),
});
