import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PetSummaryView } from '../pets/pets.dto';
import { REQUEST_STATES } from './adoption-request.schema';

export class CreateRequestDto {
  @ApiProperty({ example: 'luna' })
  @IsString({ context: { code: 'REQUIRED' } })
  @IsNotEmpty({ context: { code: 'REQUIRED' } })
  petId!: string;

  @ApiPropertyOptional({
    description: 'true = «Continuar y cancelar la anterior»: cancela la solicitud en proceso y envía esta',
    default: false,
  })
  @IsOptional()
  @IsBoolean({ context: { code: 'INVALID_OPTION' } })
  replaceActive?: boolean;
}

export class RequestView {
  @ApiProperty() id!: string;
  @ApiProperty({ enum: REQUEST_STATES }) estado!: string;
  @ApiProperty({ type: PetSummaryView }) mascota!: PetSummaryView;
  @ApiProperty({ type: String, format: 'date-time' }) createdAt!: Date;
  @ApiProperty({ type: String, format: 'date-time', nullable: true }) closedAt!: Date | null;
}

export class CurrentRequestView {
  @ApiProperty({ type: RequestView, nullable: true, description: 'Solicitud en proceso, si la hay' })
  activa!: RequestView | null;
  @ApiProperty({ type: RequestView, nullable: true, description: 'La solicitud más reciente, en cualquier estado' })
  ultima!: RequestView | null;
}

export class ResolveRequestDto {
  @ApiProperty({ enum: ['finalizada', 'rechazada'] })
  @IsIn(['finalizada', 'rechazada'], { context: { code: 'INVALID_OPTION' } })
  resultado!: 'finalizada' | 'rechazada';
}
