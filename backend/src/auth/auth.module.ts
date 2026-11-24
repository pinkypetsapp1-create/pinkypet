import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ENV, Env } from '../config/env';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthGuard, OptionalAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { GoogleAuthLibraryVerifier, GoogleVerifier } from './google-verifier';
import { RefreshToken, RefreshTokenSchema } from './refresh-token.schema';

@Global()
@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: RefreshToken.name, schema: RefreshTokenSchema }]),
    JwtModule.registerAsync({
      inject: [ENV],
      useFactory: (env: Env) => ({ secret: env.jwtSecret, signOptions: { expiresIn: env.accessTtlSeconds } }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, OptionalAuthGuard, { provide: GoogleVerifier, useClass: GoogleAuthLibraryVerifier }],
  exports: [AuthService, AuthGuard, OptionalAuthGuard],
})
export class AuthModule {}
