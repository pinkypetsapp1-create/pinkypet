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
import { PasswordReset, PasswordResetSchema } from './password-reset.schema';
import { PasswordResetService } from './password-reset.service';
import { BrevoOrLogMailer, Mailer } from '../mail/mailer';

@Global()
@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: RefreshToken.name, schema: RefreshTokenSchema },
      { name: PasswordReset.name, schema: PasswordResetSchema },
    ]),
    JwtModule.registerAsync({
      inject: [ENV],
      useFactory: (env: Env) => ({ secret: env.jwtSecret, signOptions: { expiresIn: env.accessTtlSeconds } }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthGuard,
    OptionalAuthGuard,
    PasswordResetService,
    { provide: GoogleVerifier, useClass: GoogleAuthLibraryVerifier },
    { provide: Mailer, useClass: BrevoOrLogMailer },
  ],
  exports: [AuthService, AuthGuard, OptionalAuthGuard],
})
export class AuthModule {}
