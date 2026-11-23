import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PetsModule } from '../pets/pets.module';
import { UsersModule } from '../users/users.module';
import { CompatibilityController, TestController } from './compatibility.controller';
import { CompatibilityService } from './compatibility.service';
import { Question, QuestionSchema } from './question.schema';

@Module({
  imports: [UsersModule, PetsModule, MongooseModule.forFeature([{ name: Question.name, schema: QuestionSchema }])],
  controllers: [TestController, CompatibilityController],
  providers: [CompatibilityService],
})
export class CompatibilityModule {}
