import * as argon2 from 'argon2';
import { Connection } from 'mongoose';
import { AdoptionRequest, AdoptionRequestSchema } from '../adoption-requests/adoption-request.schema';
import { RefreshToken, RefreshTokenSchema } from '../auth/refresh-token.schema';
import { Question, QuestionSchema } from '../compatibility/question.schema';
import { QUESTIONS } from '../compatibility/questions';
import { Pet, PetSchema } from '../pets/pet.schema';
import { User, UserSchema } from '../users/user.schema';
import { DEMO_ACCOUNTS, DEMO_ANSWERS } from './demo.data';
import { PETS } from './pets.data';

export interface SeedSummary {
  pets: number;
  questions: number;
  demoUsers: string[];
}

/**
 * Seed idempotente: se puede ejecutar las veces que haga falta y siempre deja el mismo estado de demo.
 * - Mascotas y preguntas: se crean o se actualizan por su id (y las mascotas vuelven a estar disponibles).
 * - Cuentas demo: se crean o se restablecen (contraseña, respuestas y solicitudes). No toca otras cuentas.
 */
export async function runSeed(conn: Connection, demoPassword: string): Promise<SeedSummary> {
  if (!demoPassword || demoPassword.length < 8) throw new Error('SEED_DEMO_PASSWORD debe tener al menos 8 caracteres');
  const model = <T>(name: string, schema: import('mongoose').Schema<T>) => conn.models[name] ?? conn.model<T>(name, schema);
  const Pets = model(Pet.name, PetSchema);
  const Questions = model(Question.name, QuestionSchema);
  const Users = model(User.name, UserSchema);
  const Requests = model(AdoptionRequest.name, AdoptionRequestSchema);
  const Tokens = model(RefreshToken.name, RefreshTokenSchema);
  await Promise.all([Pets.createIndexes(), Questions.createIndexes(), Users.createIndexes(), Requests.createIndexes()]);

  await Pets.bulkWrite(
    PETS.map((p, orden) => ({
      updateOne: { filter: { slug: p.slug }, update: { $set: { ...p, orden, disponible: true } }, upsert: true },
    })),
  );
  await Questions.bulkWrite(
    QUESTIONS.map((q) => ({
      updateOne: { filter: { id: q.id }, update: { $set: { ...q, opciones: [...q.opciones], consejo: q.consejo ?? null } }, upsert: true },
    })),
  );

  const passwordHash = await argon2.hash(demoPassword, { type: argon2.argon2id });
  const accounts: [string, typeof DEMO_ANSWERS | null][] = [
    [DEMO_ACCOUNTS.conTest, DEMO_ANSWERS],
    [DEMO_ACCOUNTS.sinTest, null],
    [DEMO_ACCOUNTS.conSolicitud, DEMO_ANSWERS],
  ];
  for (const [email, answers] of accounts) {
    const user = await Users.findOneAndUpdate(
      { email },
      { $set: { email, passwordHash, answers, answeredAt: answers ? new Date() : null } },
      { upsert: true, new: true },
    );
    await Requests.deleteMany({ userId: user._id });
    await Tokens.deleteMany({ userId: user._id });
    if (email === DEMO_ACCOUNTS.conSolicitud) {
      await Requests.create({ userId: user._id, petSlug: 'luna', estado: 'en_proceso' });
    }
  }
  return { pets: PETS.length, questions: QUESTIONS.length, demoUsers: accounts.map(([e]) => e) };
}
