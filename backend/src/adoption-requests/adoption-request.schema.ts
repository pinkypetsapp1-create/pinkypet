import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export const REQUEST_STATES = ['en_proceso', 'finalizada', 'rechazada', 'cancelada'] as const;
export type RequestState = (typeof REQUEST_STATES)[number];

@Schema({ timestamps: true, collection: 'adoption_requests' })
export class AdoptionRequest {
  @Prop({ type: Types.ObjectId, required: true, index: true }) userId!: Types.ObjectId;
  @Prop({ required: true }) petSlug!: string;
  @Prop({ required: true, enum: REQUEST_STATES, default: 'en_proceso' }) estado!: RequestState;
  @Prop({ type: Date, default: null }) closedAt!: Date | null;
}

export type AdoptionRequestDocument = HydratedDocument<AdoptionRequest> & { createdAt: Date; updatedAt: Date };
export const AdoptionRequestSchema = SchemaFactory.createForClass(AdoptionRequest);

// REGLA DE ORO 5: una sola solicitud activa por persona, garantizada por la base de datos.
// Índice único parcial: solo entran en él las solicitudes en proceso, así que puede haber
// muchas cerradas pero nunca dos «en_proceso» del mismo userId (aunque el código fallara).
AdoptionRequestSchema.index(
  { userId: 1 },
  { unique: true, partialFilterExpression: { estado: 'en_proceso' }, name: 'una_solicitud_activa_por_persona' },
);
