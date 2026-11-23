import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import type { Answers } from '../compatibility/questions';

@Schema({ timestamps: true, collection: 'users' })
export class User {
  /** Siempre en minúsculas y sin espacios; índice único. */
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  /** Hash argon2id. La contraseña nunca se guarda. */
  @Prop({ required: true })
  passwordHash!: string;

  /** Respuestas del test (texto literal de cada opción), o null si aún no lo ha hecho. */
  @Prop({ type: Object, default: null })
  answers!: Answers | null;

  @Prop({ type: Date, default: null })
  answeredAt!: Date | null;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
