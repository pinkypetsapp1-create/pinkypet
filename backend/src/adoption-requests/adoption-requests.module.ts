import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PetsModule } from '../pets/pets.module';
import { UsersModule } from '../users/users.module';
import { AdoptionRequest, AdoptionRequestSchema } from './adoption-request.schema';
import { AdoptionRequestsController } from './adoption-requests.controller';
import { AdoptionRequestsService } from './adoption-requests.service';

@Module({
  imports: [
    UsersModule,
    PetsModule,
    MongooseModule.forFeature([{ name: AdoptionRequest.name, schema: AdoptionRequestSchema }]),
  ],
  controllers: [AdoptionRequestsController],
  providers: [AdoptionRequestsService],
  exports: [AdoptionRequestsService],
})
export class AdoptionRequestsModule {}
