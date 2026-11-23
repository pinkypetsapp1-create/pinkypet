import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Errors } from '../common/errors';
import { UsersService } from '../users/users.service';
import { LoginDto, RefreshDto, RegisterDto, SessionView, UserView } from './auth.dto';
import { AuthGuard, UserId } from './auth.guard';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService, private readonly users: UsersService) {}

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
