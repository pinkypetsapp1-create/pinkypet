import { Body, Controller, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard, UserId } from '../auth/auth.guard';
import { AdoptionRequestsService } from './adoption-requests.service';
import { CreateRequestDto, CurrentRequestView, RequestView } from './adoption-requests.dto';

@ApiTags('requests')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('requests')
export class AdoptionRequestsController {
  constructor(private readonly svc: AdoptionRequestsService) {}

  @Post()
  @ApiOperation({ summary: 'Enviar una solicitud de adopción (exige el test hecho)' })
  @ApiResponse({ status: 201, type: RequestView })
  @ApiResponse({ status: 403, description: 'TEST_REQUIRED' })
  @ApiResponse({ status: 404, description: 'PET_NOT_FOUND' })
  @ApiResponse({ status: 409, description: 'ACTIVE_REQUEST_EXISTS (diálogo de Ficha-Limite) · PET_NOT_AVAILABLE' })
  create(@UserId() userId: string, @Body() dto: CreateRequestDto): Promise<RequestView> {
    return this.svc.create(userId, dto.petId, dto.replaceActive ?? false);
  }

  @Get('current')
  @ApiOperation({ summary: 'Solicitud en proceso y la más reciente (para «Proceso» y el estado)' })
  @ApiResponse({ status: 200, type: CurrentRequestView })
  current(@UserId() userId: string): Promise<CurrentRequestView> {
    return this.svc.current(userId);
  }

  @Post(':id/cancel')
  @HttpCode(200)
  @ApiOperation({ summary: 'Cancelar la solicitud en proceso (la mascota sigue disponible)' })
  @ApiResponse({ status: 200, type: RequestView })
  @ApiResponse({ status: 404, description: 'REQUEST_NOT_FOUND' })
  @ApiResponse({ status: 409, description: 'REQUEST_NOT_CANCELLABLE' })
  cancel(@UserId() userId: string, @Param('id') id: string): Promise<RequestView> {
    return this.svc.cancel(userId, id);
  }
}
