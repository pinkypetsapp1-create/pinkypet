import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import type { PetAttributes } from '../compatibility/rules';

@Schema({ _id: false })
class Foto {
  /** Clave del asset empaquetado en la app (las imágenes no se sirven desde el backend). */
  @Prop({ required: true }) asset!: string;
  @Prop({ required: true }) alt!: string;
}

@Schema({ timestamps: true, collection: 'pets' })
export class Pet {
  /** Identificador estable y legible (luna, simba…). */
  @Prop({ required: true, unique: true }) slug!: string;
  @Prop({ required: true }) nombre!: string;
  @Prop({ required: true }) especie!: string;
  @Prop({ required: true }) sexo!: string;
  @Prop({ required: true }) edad!: string;
  @Prop({ required: true }) ciudad!: string;
  @Prop({ required: true, index: true }) provincia!: string;
  @Prop({ required: true }) tamano!: string;
  @Prop({ required: true, enum: ['gato', 'perro', 'otros'], index: true }) tipo!: 'gato' | 'perro' | 'otros';
  @Prop({ required: true }) necesidadesEspeciales!: boolean;
  @Prop({ type: Object, required: true }) info!: Record<string, string>;
  @Prop({ required: true }) encaja!: string;
  @Prop({ required: true }) cuenta!: string;
  @Prop({ required: true }) motivoCorto!: string;
  @Prop({ type: Foto, required: true }) foto!: Foto;
  /** Atributos estructurados para el cálculo (docs/SPEC.md §4.1). No se exponen en la API. */
  @Prop({ type: Object, required: true }) atributos!: PetAttributes;
  /** Pasa a false cuando la protectora cierra una solicitud (adoptada o retirada). */
  @Prop({ required: true, default: true }) disponible!: boolean;
  @Prop({ required: true }) orden!: number;
}

export type PetDocument = HydratedDocument<Pet>;
export const PetSchema = SchemaFactory.createForClass(Pet);
