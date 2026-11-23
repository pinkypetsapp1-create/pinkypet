import { Body, Controller, Get, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard, UserId } from '../auth/auth.guard';
import { PetFiltersDto } from '../pets/pets.dto';
import { AnswersDto, AnswersView, CompatibilityListView, TestView } from './compatibility.dto';
import { CompatibilityService } from './compatibility.service';

@ApiTags('test')
@Controller('test')
export class TestController {
  constructor(private readonly svc: CompatibilityService) {}

  @Get('questions')
  @ApiOperation({ summary: 'Las 15 preguntas en 3 bloques, con sus opciones y consejos' })
  @ApiResponse({ status: 200, type: TestView })
  questions(): Promise<TestView> {
    return this.svc.test();
  }

  @Get('answers')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Respuestas guardadas (null si aún no ha hecho el test)' })
  @ApiResponse({ status: 200, type: AnswersView })
  answers(@UserId() userId: string) {
    return this.svc.answers(userId);
  }

  @Put('answers')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Guardar o modificar las 15 respuestas (recalcula la compatibilidad)' })
  @ApiResponse({ status: 200, type: AnswersView })
  @ApiResponse({ status: 400, description: 'VALIDATION_FAILED · fields.qN [REQUIRED | INVALID_OPTION]' })
  save(@UserId() userId: string, @Body() dto: AnswersDto) {
    return this.svc.saveAnswers(userId, dto.answers);
  }
}

@ApiTags('compatibility')
@Controller('compatibility')
export class CompatibilityController {
  constructor(private readonly svc: CompatibilityService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mascotas compatibles con la persona, de mayor a menor %. Admite los filtros del catálogo.' })
  @ApiResponse({ status: 200, type: CompatibilityListView })
  @ApiResponse({ status: 403, description: 'TEST_REQUIRED' })
  list(@UserId() userId: string, @Query() filters: PetFiltersDto): Promise<CompatibilityListView> {
    return this.svc.compatibles(userId, filters);
  }
}
