import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Errors } from '../common/errors';
import { PetsService } from '../pets/pets.service';
import { UsersService } from '../users/users.service';
import { AdoptionRequest, AdoptionRequestDocument } from './adoption-request.schema';
import { CurrentRequestView, RequestView } from './adoption-requests.dto';

const isDuplicate = (e: unknown) => (e as { code?: number }).code === 11000;

@Injectable()
export class AdoptionRequestsService implements OnModuleInit {
  constructor(
    @InjectModel(AdoptionRequest.name) private readonly requests: Model<AdoptionRequestDocument>,
    private readonly users: UsersService,
    private readonly pets: PetsService,
  ) {}

  /** Crea los índices (incluido el único parcial) antes de aceptar peticiones. */
  async onModuleInit(): Promise<void> {
    await this.requests.createIndexes();
  }

  async create(userId: string, petSlug: string, replaceActive = false): Promise<RequestView> {
    const user = await this.users.findById(userId);
    if (!user) throw Errors.unauthorized();
    if (!user.answers) throw Errors.testRequired();
    const pet = await this.pets.findBySlug(petSlug);
    if (!pet) throw Errors.petNotFound();
    if (!pet.disponible) throw Errors.petNotAvailable();

    const uid = new Types.ObjectId(userId);
    const active = await this.requests.findOne({ userId: uid, estado: 'en_proceso' });
    if (active) {
      // Misma mascota, o no se ha pedido sustituir: diálogo «¿Cancelar tu solicitud anterior?».
      if (!replaceActive || active.petSlug === petSlug) throw Errors.activeRequestExists();
      await this.requests.updateOne({ _id: active._id, estado: 'en_proceso' }, { estado: 'cancelada', closedAt: new Date() });
    }
    try {
      const doc = await this.requests.create({ userId: uid, petSlug, estado: 'en_proceso' });
      return this.view(doc, user.answers);
    } catch (e) {
      // El índice único parcial es la última barrera: dos envíos a la vez nunca dejan dos solicitudes activas.
      if (isDuplicate(e)) throw Errors.activeRequestExists();
      throw e;
    }
  }

  async current(userId: string): Promise<CurrentRequestView> {
    const user = await this.users.findById(userId);
    if (!user) throw Errors.unauthorized();
    const uid = new Types.ObjectId(userId);
    const [activa, ultima] = await Promise.all([
      this.requests.findOne({ userId: uid, estado: 'en_proceso' }),
      this.requests.findOne({ userId: uid }).sort({ createdAt: -1, _id: -1 }),
    ]);
    return {
      activa: activa ? await this.view(activa, user.answers) : null,
      ultima: ultima ? await this.view(ultima, user.answers) : null,
    };
  }

  async cancel(userId: string, requestId: string): Promise<RequestView> {
    const user = await this.users.findById(userId);
    if (!user) throw Errors.unauthorized();
    if (!Types.ObjectId.isValid(requestId)) throw Errors.requestNotFound();
    const doc = await this.requests.findOne({ _id: requestId, userId: new Types.ObjectId(userId) });
    if (!doc) throw Errors.requestNotFound();
    if (doc.estado !== 'en_proceso') throw Errors.requestNotCancellable();
    doc.estado = 'cancelada';
    doc.closedAt = new Date();
    await doc.save();
    // La mascota sigue disponible: no se toca.
    return this.view(doc, user.answers);
  }

  /** Solo desarrollo: simula la respuesta de la protectora. La mascota deja de estar disponible. */
  async resolve(requestId: string, resultado: 'finalizada' | 'rechazada'): Promise<RequestView> {
    if (!Types.ObjectId.isValid(requestId)) throw Errors.requestNotFound();
    const doc = await this.requests.findById(requestId);
    if (!doc) throw Errors.requestNotFound();
    if (doc.estado !== 'en_proceso') throw Errors.requestNotCancellable();
    doc.estado = resultado;
    doc.closedAt = new Date();
    await doc.save();
    await this.pets.setAvailable(doc.petSlug, false);
    const user = await this.users.findById(doc.userId.toString());
    return this.view(doc, user?.answers ?? null);
  }

  private async view(doc: AdoptionRequestDocument, answers: Parameters<typeof PetsService.summary>[1]): Promise<RequestView> {
    const pet = await this.pets.findBySlug(doc.petSlug);
    if (!pet) throw Errors.petNotFound();
    return {
      id: doc.id as string,
      estado: doc.estado,
      mascota: PetsService.summary(pet, answers),
      createdAt: doc.createdAt,
      closedAt: doc.closedAt,
    };
  }
}
