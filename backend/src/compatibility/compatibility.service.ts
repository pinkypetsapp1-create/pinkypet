import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Errors } from '../common/errors';
import { PetFiltersDto } from '../pets/pets.dto';
import { PetsService } from '../pets/pets.service';
import { UsersService } from '../users/users.service';
import { CompatibilityListView, TestView } from './compatibility.dto';
import { Question, QuestionDocument } from './question.schema';
import { Answers, BLOCKS, validateAnswers } from './questions';
import { COMPATIBLE_THRESHOLD } from './rules';

@Injectable()
export class CompatibilityService implements OnModuleInit {
  constructor(
    @InjectModel(Question.name) private readonly questions: Model<QuestionDocument>,
    private readonly users: UsersService,
    private readonly pets: PetsService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.questions.createIndexes();
  }

  async test(): Promise<TestView> {
    const qs = await this.questions.find().sort({ numero: 1 }).lean();
    return {
      bloques: BLOCKS.map((b) => ({ ...b })),
      preguntas: qs.map(({ id, numero, bloque, texto, resumen, opciones, consejo }) => ({
        id, numero, bloque, texto, resumen, opciones, ...(consejo ? { consejo } : {}),
      })),
    };
  }

  /** Guarda las 15 respuestas. Si falta alguna, VALIDATION_FAILED con fields.qN = ['REQUIRED'] (Test-Error). */
  async saveAnswers(userId: string, input: Record<string, unknown>) {
    const fields = validateAnswers(input);
    if (Object.keys(fields).length) throw Errors.validation(fields);
    const user = await this.users.saveAnswers(userId, input as Answers);
    if (!user) throw Errors.unauthorized();
    return { answers: user.answers, answeredAt: user.answeredAt };
  }

  async answers(userId: string) {
    const user = await this.users.findById(userId);
    if (!user) throw Errors.unauthorized();
    return { answers: user.answers, answeredAt: user.answeredAt };
  }

  async compatibles(userId: string, filters: PetFiltersDto): Promise<CompatibilityListView> {
    const user = await this.users.findById(userId);
    if (!user) throw Errors.unauthorized();
    if (!user.answers) throw Errors.testRequired();
    const all = await this.pets.list(filters, user.answers);
    const items = all.filter((p) => p.compatibilidad!.compatible);
    return { items, sinCompatibles: items.length === 0, umbral: COMPATIBLE_THRESHOLD };
  }
}
