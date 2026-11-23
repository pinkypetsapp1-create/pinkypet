import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'questions' })
export class Question {
  @Prop({ required: true, unique: true }) id!: string;
  @Prop({ required: true }) numero!: number;
  @Prop({ required: true }) bloque!: string;
  @Prop({ required: true }) texto!: string;
  @Prop({ required: true }) resumen!: string;
  @Prop({ type: [String], required: true }) opciones!: string[];
  @Prop({ type: String, default: null }) consejo!: string | null;
}

export type QuestionDocument = HydratedDocument<Question>;
export const QuestionSchema = SchemaFactory.createForClass(Question);
