import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { Pet, PetSchema } from './pet.schema';
import { PetsController } from './pets.controller';
import { PetsService } from './pets.service';

@Module({
  imports: [UsersModule, MongooseModule.forFeature([{ name: Pet.name, schema: PetSchema }])],
  controllers: [PetsController],
  providers: [PetsService],
  exports: [PetsService],
})
export class PetsModule {}
