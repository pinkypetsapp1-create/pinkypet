import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject } from 'class-validator';
import { PetSummaryView } from '../pets/pets.dto';

export class QuestionView {
  @ApiProperty({ example: 'q1' }) id!: string;
  @ApiProperty() numero!: number;
  @ApiProperty({ enum: ['hogar', 'diaADia', 'mascota'] }) bloque!: string;
  @ApiProperty() texto!: string;
  @ApiProperty({ description: 'Etiqueta corta de «Mi perfil»' }) resumen!: string;
  @ApiProperty({ type: [String] }) opciones!: string[];
  @ApiPropertyOptional({ description: '«Consejo del experto»' }) consejo?: string;
}

export class BlockView {
  @ApiProperty({ enum: ['hogar', 'diaADia', 'mascota'] }) id!: string;
  @ApiProperty() titulo!: string;
  @ApiProperty({ example: 0.34 }) peso!: number;
}

export class TestView {
  @ApiProperty({ type: [BlockView] }) bloques!: BlockView[];
  @ApiProperty({ type: [QuestionView] }) preguntas!: QuestionView[];
}

export class AnswersDto {
  @ApiProperty({
    description: 'Las 15 respuestas, con el texto literal de la opción elegida',
    example: { q1: 'No', q2: 'No', q3: 'Vivo sola o solo' },
    additionalProperties: { type: 'string' },
  })
  @IsObject({ context: { code: 'REQUIRED' } })
  answers!: Record<string, unknown>;
}

export class AnswersView {
  @ApiProperty({ additionalProperties: { type: 'string' }, nullable: true }) answers!: Record<string, string> | null;
  @ApiProperty({ type: String, format: 'date-time', nullable: true }) answeredAt!: Date | null;
}

export class CompatibilityListView {
  @ApiProperty({ type: [PetSummaryView], description: 'Mascotas compatibles (≥ 50 %), de mayor a menor' })
  items!: PetSummaryView[];
  @ApiProperty({ description: 'true → pantalla «Todavía no hay mascotas compatibles contigo»' })
  sinCompatibles!: boolean;
  @ApiProperty({ example: 50 }) umbral!: number;
}
