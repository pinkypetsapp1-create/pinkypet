import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { AdoptionRequestsModule } from './adoption-requests/adoption-requests.module';
import { AuthModule } from './auth/auth.module';
import { CompatibilityModule } from './compatibility/compatibility.module';
import { ConfigModule } from './config/config.module';
import { Env } from './config/env';
import { DevModule } from './dev/dev.module';
import { HealthController } from './health/health.controller';
import { PetsModule } from './pets/pets.module';

@Module({})
export class AppModule {
  static forRoot(env: Env): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.forRoot(env),
        MongooseModule.forRoot(env.mongodbUri, { serverSelectionTimeoutMS: 10_000 }),
        // Límite de intentos: solo se aplica en login y registro (ThrottlerGuard en esas rutas).
        ThrottlerModule.forRoot([{ name: 'auth', ttl: 60_000, limit: env.authThrottleLimit }]),
        AuthModule,
        PetsModule,
        CompatibilityModule,
        AdoptionRequestsModule,
        // El simulador de la protectora no se registra en producción.
        ...(env.nodeEnv === 'production' ? [] : [DevModule]),
      ],
      controllers: [HealthController],
    };
  }
}
