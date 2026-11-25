import { Body, Controller, Get, HttpCode, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Errors } from '../common/errors';
import { UsersService } from '../users/users.service';
import { ForgotPasswordDto, GoogleLoginDto, GoogleSessionView, LoginDto, RefreshDto, RegisterDto, ResetPasswordDto, SessionView, UserView } from './auth.dto';
import { PasswordResetService } from './password-reset.service';
import { AuthGuard, UserId } from './auth.guard';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService, private readonly users: UsersService, private readonly resets: PasswordResetService) {}

  @Post('register')
  @UseGuards(ThrottlerGuard)
  @ApiOperation({ summary: 'Crear cuenta (inicia sesión directamente)' })
  @ApiResponse({ status: 201, type: SessionView })
  @ApiResponse({ status: 400, description: 'VALIDATION_FAILED · fields.email [FORMAT] · fields.password [MIN_LENGTH]' })
  @ApiResponse({ status: 409, description: 'EMAIL_ALREADY_REGISTERED' })
  @ApiResponse({ status: 429, description: 'TOO_MANY_ATTEMPTS' })
  register(@Body() dto: RegisterDto): Promise<SessionView> {
    return this.auth.register(dto.email, dto.password);
  }

  @Post('login')
  @HttpCode(200)
  @UseGuards(ThrottlerGuard)
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, type: SessionView })
  @ApiResponse({ status: 401, description: 'AUTH_INVALID_CREDENTIALS' })
  @ApiResponse({ status: 429, description: 'TOO_MANY_ATTEMPTS' })
  login(@Body() dto: LoginDto): Promise<SessionView> {
    return this.auth.login(dto.email, dto.password);
  }

  @Post('google')
  @HttpCode(200)
  @UseGuards(ThrottlerGuard)
  @ApiOperation({ summary: '«Continuar con Google»: inicia sesión o crea la cuenta con un ID token de Google' })
  @ApiResponse({ status: 200, type: GoogleSessionView })
  @ApiResponse({ status: 401, description: 'GOOGLE_TOKEN_INVALID' })
  @ApiResponse({ status: 503, description: 'GOOGLE_NOT_CONFIGURED' })
  google(@Body() dto: GoogleLoginDto): Promise<GoogleSessionView> {
    return this.auth.loginWithGoogle(dto.idToken);
  }

  @Post('password/forgot')
  @HttpCode(202)
  @UseGuards(ThrottlerGuard)
  @ApiOperation({ summary: '«¿Has olvidado tu contraseña?»: envía un enlace (la respuesta es la misma exista o no la cuenta)' })
  @ApiResponse({ status: 202, description: 'Petición aceptada' })
  @ApiResponse({ status: 429, description: 'TOO_MANY_ATTEMPTS' })
  async forgot(@Body() dto: ForgotPasswordDto): Promise<{ ok: true }> {
    await this.resets.request(dto.email);
    return { ok: true };
  }

  @Get('password/reset')
  @ApiOperation({ summary: 'Comprueba si el enlace del correo sigue valiendo (sin usarlo)' })
  @ApiResponse({ status: 200, description: 'El enlace vale' })
  @ApiResponse({ status: 410, description: 'RESET_TOKEN_INVALID' })
  async checkReset(@Query('token') token: string): Promise<{ ok: true }> {
    await this.resets.check(token);
    return { ok: true };
  }

  @Post('password/reset')
  @HttpCode(200)
  @UseGuards(ThrottlerGuard)
  @ApiOperation({ summary: 'Guarda la contraseña nueva, gasta el enlace y cierra todas las sesiones' })
  @ApiResponse({ status: 200, description: 'Contraseña cambiada' })
  @ApiResponse({ status: 400, description: 'VALIDATION_FAILED · fields.password [MIN_LENGTH]' })
  @ApiResponse({ status: 410, description: 'RESET_TOKEN_INVALID' })
  async reset(@Body() dto: ResetPasswordDto): Promise<{ ok: true }> {
    await this.resets.reset(dto.token, dto.password);
    return { ok: true };
  }

  @Post('refresh')
  @HttpCode(200)
  @ApiOperation({ summary: 'Renovar la sesión (el token de renovación usado deja de valer)' })
  @ApiResponse({ status: 200, type: SessionView })
  @ApiResponse({ status: 401, description: 'REFRESH_INVALID' })
  refresh(@Body() dto: RefreshDto): Promise<SessionView> {
    return this.auth.refresh(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(204)
  @ApiOperation({ summary: 'Cerrar sesión (revoca el token de renovación)' })
  async logout(@Body() dto: RefreshDto): Promise<void> {
    await this.auth.logout(dto.refreshToken);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: UserView })
  @ApiResponse({ status: 401, description: 'AUTH_UNAUTHORIZED' })
  async me(@UserId() userId: string): Promise<UserView> {
    const user = await this.users.findById(userId);
    if (!user) throw Errors.unauthorized();
    return AuthService.toView(user);
  }
}
