import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

// Enlace de «Recuperar contraseña». El correo lleva «<id>.<secreto>»; aquí solo se guarda el HMAC del secreto.
@Schema({ timestamps: true, collection: 'password_resets' })
export class PasswordReset {
  @Prop({ type: Types.ObjectId, required: true, index: true }) userId!: Types.ObjectId;
  @Prop({ required: true }) secretHash!: string;
  @Prop({ type: Date, required: true }) expiresAt!: Date;
  /** Un solo uso: se rellena al cambiar la contraseña o al pedir un enlace nuevo. */
  @Prop({ type: Date, default: null }) usedAt!: Date | null;
}

export type PasswordResetDocument = HydratedDocument<PasswordReset>;
export const PasswordResetSchema = SchemaFactory.createForClass(PasswordReset);
PasswordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
