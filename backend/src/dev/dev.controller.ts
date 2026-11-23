import { Body, CanActivate, Controller, ExecutionContext, HttpCode, Inject, Injectable, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { timingSafeEqual } from 'node:crypto';
import { ResolveRequestDto, RequestView } from '../adoption-requests/adoption-requests.dto';
import { AdoptionRequestsService } from '../adoption-requests/adoption-requests.service';
import { ENV, Env } from '../config/env';

/** Sin la cabecera X-Dev-Key correcta, el endpoint responde 404, como si no existiera. */
@Injectable()
class DevKeyGuard implements CanActivate {
  constructor(@Inject(ENV) private readonly env: Env) {}
  canActivate(ctx: ExecutionContext): boolean {
    const given = Buffer.from(String(ctx.switchToHttp().getRequest<Request>().headers['x-dev-key'] ?? ''));
    const key = Buffer.from(this.env.devKey ?? '');
    if (!this.env.devKey || given.length !== key.length || !timingSafeEqual(given, key)) throw new NotFoundException();
    return true;
  }
}

@ApiTags('dev (solo desarrollo)')
@Controller('dev')
@UseGuards(DevKeyGuard)
export class DevController {
  constructor(private readonly requests: AdoptionRequestsService) {}

  @Post('requests/:id/resolve')
  @HttpCode(200)
  @ApiHeader({ name: 'X-Dev-Key', required: true })
  @ApiOperation({ summary: 'Simular la respuesta de la protectora (no existe en producción)' })
  @ApiResponse({ status: 200, type: RequestView })
  resolve(@Param('id') id: string, @Body() dto: ResolveRequestDto): Promise<RequestView> {
    return this.requests.resolve(id, dto.resultado);
  }
}
