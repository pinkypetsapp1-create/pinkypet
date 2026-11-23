import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';

const asList = ({ value }: { value: unknown }) =>
  value === undefined ? undefined : (Array.isArray(value) ? value : String(value).split(',')).map((v) => String(v).trim()).filter(Boolean);

export class PetFiltersDto {
  @ApiPropertyOptional({ description: 'Uno o varios, separados por comas: gato, perro, otros', example: 'gato,otros' })
  @IsOptional()
  @Transform(asList)
  @IsIn(['gato', 'perro', 'otros'], { each: true, context: { code: 'INVALID_OPTION' } })
  tipo?: ('gato' | 'perro' | 'otros')[];

  @ApiPropertyOptional({ description: 'true: solo mascotas con necesidades especiales' })
  @IsOptional()
  @Transform(({ value }) => (value === 'true' || value === true ? true : value === 'false' || value === false ? false : value))
  @IsBoolean({ context: { code: 'INVALID_OPTION' } })
  ne?: boolean;

  @ApiPropertyOptional({ example: 'Barcelona' })
  @IsOptional()
  @IsString({ context: { code: 'INVALID_OPTION' } })
  provincia?: string;
}

export class BlocksView {
  @ApiProperty() hogar!: number;
  @ApiProperty() diaADia!: number;
  @ApiProperty() mascota!: number;
}

export class CompatibilityView {
  @ApiProperty({ description: 'Global, 0–100' }) porcentaje!: number;
  @ApiProperty({ type: BlocksView }) bloques!: BlocksView;
  @ApiProperty({ description: 'porcentaje ≥ 50' }) compatible!: boolean;
}

export class FotoView {
  @ApiProperty({ example: 'fotos/luna.jpg', description: 'Clave del asset empaquetado en la app' }) asset!: string;
  @ApiProperty() alt!: string;
}

export class PetSummaryView {
  @ApiProperty({ example: 'luna' }) id!: string;
  @ApiProperty() nombre!: string;
  @ApiProperty({ example: 'Gata' }) especie!: string;
  @ApiProperty() sexo!: string;
  @ApiProperty() edad!: string;
  @ApiProperty() ciudad!: string;
  @ApiProperty() provincia!: string;
  @ApiProperty() tamano!: string;
  @ApiProperty({ enum: ['gato', 'perro', 'otros'] }) tipo!: string;
  @ApiProperty() necesidadesEspeciales!: boolean;
  @ApiProperty({ example: 'Encaja con tu rutina' }) motivoCorto!: string;
  @ApiProperty({ type: FotoView }) foto!: FotoView;
  @ApiPropertyOptional({ type: CompatibilityView, description: 'Solo con sesión y test hecho' })
  compatibilidad?: CompatibilityView;
}

export class PetInfoView {
  @ApiProperty() estadoSalud!: string;
  @ApiProperty() vacunacion!: string;
  @ApiProperty() cuidados!: string;
  @ApiProperty() comportamiento!: string;
  @ApiProperty() nivelActividad!: string;
  @ApiProperty() convivenciaMascotas!: string;
  @ApiProperty() necesidadesEspeciales!: string;
  @ApiProperty() historia!: string;
}

export class PetDetailView extends PetSummaryView {
  @ApiProperty({ type: PetInfoView }) info!: PetInfoView;
  @ApiProperty({ description: '«Lo que encaja contigo»' }) encaja!: string;
  @ApiProperty({ description: '«Para que os vaya bien»' }) cuenta!: string;
  @ApiProperty() disponible!: boolean;
}

export class PetListView {
  @ApiProperty({ type: [PetSummaryView] }) items!: PetSummaryView[];
  @ApiProperty({ description: 'Número de resultados («6 mascotas»)' }) total!: number;
}
