import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ErrorFilter } from './common/error.filter';
import { validationPipe } from './common/validation';
import { Env } from './config/env';

/** Crea la app con la misma configuración en producción, en los tests y en los scripts. */
export async function createApp(env: Env, opts: { logger?: false } = {}): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule.forRoot(env), { logger: opts.logger ?? ['error', 'warn', 'log'] });
  app.useGlobalPipes(validationPipe);
  app.useGlobalFilters(new ErrorFilter());
  app.enableCors({
    origin: (origin: string | undefined, cb: (err: Error | null, allow?: boolean) => void) =>
      cb(null, !origin || env.corsOrigins.includes(origin)),
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  // Render pasa por un proxy: así el límite de intentos ve la IP real.
  app.getHttpAdapter().getInstance().set('trust proxy', 1);
  app.enableShutdownHooks();
  SwaggerModule.setup('docs', app, buildOpenApi(app));
  return app;
}

export function buildOpenApi(app: INestApplication): OpenAPIObject {
  const config = new DocumentBuilder()
    .setTitle('Pinky Pet API')
    .setDescription(
      'API del proyecto académico Pinky Pet. Los errores siempre son { code, message, fields? }; la app traduce `code` a los textos del diseño. ' +
        'El % de compatibilidad es una simulación académica, no un instrumento validado.',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  return SwaggerModule.createDocument(app, config);
}
