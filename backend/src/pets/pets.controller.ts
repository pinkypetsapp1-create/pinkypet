import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OptionalAuthGuard, UserId } from '../auth/auth.guard';
import { UsersService } from '../users/users.service';
import { PetDetailView, PetFiltersDto, PetListView } from './pets.dto';
import { PetsService } from './pets.service';

@ApiTags('pets')
@ApiBearerAuth()
@Controller('pets')
@UseGuards(OptionalAuthGuard)
export class PetsController {
  constructor(private readonly pets: PetsService, private readonly users: UsersService) {}

  private async answersOf(userId?: string) {
    return userId ? ((await this.users.findById(userId))?.answers ?? null) : null;
  }

  @Get()
  @ApiOperation({ summary: 'Catálogo con filtros. Sin sesión o sin test: sin % y en el orden del catálogo.' })
  @ApiResponse({ status: 200, type: PetListView })
  async list(@Query() filters: PetFiltersDto, @UserId() userId?: string): Promise<PetListView> {
    const items = await this.pets.list(filters, await this.answersOf(userId));
    return { items, total: items.length };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ficha de la mascota' })
  @ApiResponse({ status: 200, type: PetDetailView })
  @ApiResponse({ status: 404, description: 'PET_NOT_FOUND' })
  async detail(@Param('id') id: string, @UserId() userId?: string): Promise<PetDetailView> {
    return this.pets.detail(id, await this.answersOf(userId));
  }
}
