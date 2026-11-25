import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

// Misma comprobación de correo que el diseño (Registro.dc.html / Login.dc.html).
export const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export class RegisterDto {
  @ApiProperty({ example: 'nombre@correo.com' })
  @IsString({ context: { code: 'FORMAT' } })
  @Matches(EMAIL_PATTERN, { context: { code: 'FORMAT' } })
  @MaxLength(254, { context: { code: 'FORMAT' } })
  email!: string;

  @ApiProperty({ minLength: 8, example: 'contraseña-segura' })
  @IsString({ context: { code: 'MIN_LENGTH' } })
  @MinLength(8, { context: { code: 'MIN_LENGTH' } })
  @MaxLength(128, { context: { code: 'MAX_LENGTH' } })
  password!: string;
}

export class LoginDto {
  @ApiProperty({ example: 'persona@ejemplo.com' })
  @IsString({ context: { code: 'FORMAT' } })
  @Matches(EMAIL_PATTERN, { context: { code: 'FORMAT' } })
  email!: string;

  @ApiProperty()
  @IsString({ context: { code: 'REQUIRED' } })
  @IsNotEmpty({ context: { code: 'REQUIRED' } })
  @MaxLength(128, { context: { code: 'MAX_LENGTH' } })
  password!: string;
}

export class RefreshDto {
  @ApiProperty({ description: 'Token de renovación recibido al iniciar sesión o en la última renovación' })
  @IsString({ context: { code: 'REQUIRED' } })
  @IsNotEmpty({ context: { code: 'REQUIRED' } })
  refreshToken!: string;
}

export class UserView {
  @ApiProperty() id!: string;
  @ApiProperty() email!: string;
  @ApiProperty({ description: 'true si ya ha respondido el test de compatibilidad' }) hasTest!: boolean;
}

export class SessionView {
  @ApiProperty() accessToken!: string;
  @ApiProperty({ description: 'Segundos de vida del accessToken' }) expiresIn!: number;
  @ApiProperty() refreshToken!: string;
  @ApiProperty({ type: UserView }) user!: UserView;
}

export class GoogleLoginDto {
  @ApiProperty({ description: 'ID token que devuelve el inicio de sesión de Google en la app' })
  @IsString({ context: { code: 'REQUIRED' } })
  @IsNotEmpty({ context: { code: 'REQUIRED' } })
  @MaxLength(4096, { context: { code: 'MAX_LENGTH' } })
  idToken!: string;
}

export class GoogleSessionView extends SessionView {
  @ApiProperty({ description: 'true si la cuenta se acaba de crear (desde Registro se va al Test)' }) created!: boolean;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'nombre@correo.com' })
  @IsString({ context: { code: 'FORMAT' } })
  @Matches(EMAIL_PATTERN, { context: { code: 'FORMAT' } })
  @MaxLength(254, { context: { code: 'FORMAT' } })
  email!: string;
}

export class ResetPasswordDto {
  @ApiProperty({ description: 'El «token» del enlace del correo' })
  @IsString({ context: { code: 'REQUIRED' } })
  @IsNotEmpty({ context: { code: 'REQUIRED' } })
  @MaxLength(256, { context: { code: 'MAX_LENGTH' } })
  token!: string;

  @ApiProperty({ minLength: 8 })
  @IsString({ context: { code: 'MIN_LENGTH' } })
  @MinLength(8, { context: { code: 'MIN_LENGTH' } })
  @MaxLength(128, { context: { code: 'MAX_LENGTH' } })
  password!: string;
}
