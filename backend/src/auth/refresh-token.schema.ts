import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

// Token de renovación. El cliente recibe «<id>.<secreto>»; aquí solo se guarda el HMAC del secreto.
@Schema({ timestamps: true, collection: 'refresh_tokens' })
export class RefreshToken {
  @Prop({ type: Types.ObjectId, required: true, index: true }) userId!: Types.ObjectId;
  /** Todos los tokens que salen de un mismo inicio de sesión comparten familia. */
  @Prop({ required: true, index: true }) family!: string;
  @Prop({ required: true }) secretHash!: string;
  @Prop({ type: Date, required: true }) expiresAt!: Date;
  /** Se rellena al rotarlo, al cerrar sesión o al detectar una reutilización. */
  @Prop({ type: Date, default: null }) revokedAt!: Date | null;
}

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;
export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
// Mongo borra solo los tokens caducados.
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
