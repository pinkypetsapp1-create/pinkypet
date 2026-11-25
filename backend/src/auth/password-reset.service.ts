import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as argon2 from 'argon2';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { Model, Types } from 'mongoose';
import { Errors } from '../common/errors';
import { ENV, Env } from '../config/env';
import { Mailer } from '../mail/mailer';
import { User, UserDocument } from '../users/user.schema';
import { PasswordReset, PasswordResetDocument } from './password-reset.schema';
import { RefreshToken, RefreshTokenDocument } from './refresh-token.schema';

const TTL_MS = 60 * 60 * 1000; // el enlace caduca en 1 hora

@Injectable()
export class PasswordResetService {
  private readonly logger = new Logger('PasswordReset');
  constructor(
    @Inject(ENV) private readonly env: Env,
    @InjectModel(User.name) private readonly users: Model<UserDocument>,
    @InjectModel(PasswordReset.name) private readonly resets: Model<PasswordResetDocument>,
    @InjectModel(RefreshToken.name) private readonly tokens: Model<RefreshTokenDocument>,
    private readonly mailer: Mailer,
  ) {}

  /**
   * Siempre responde igual, exista o no la cuenta (no revela qué correos están registrados).
   * Si existe: anula los enlaces anteriores y envía uno nuevo.
   */
  async request(email: string): Promise<void> {
    const user = await this.users.findOne({ email: email.trim().toLowerCase() });
    if (!user) return;
    await this.resets.updateMany({ userId: user._id, usedAt: null }, { usedAt: new Date() });
    const secret = randomBytes(32).toString('base64url');
    const doc = await this.resets.create({ userId: user._id, secretHash: this.hmac(secret), expiresAt: new Date(Date.now() + TTL_MS) });
    const link = `${this.env.appUrl}/nueva-contrasena?token=${doc.id}.${secret}`;
    try {
      await this.mailer.send({
        to: user.email,
        subject: 'Crea una contraseña nueva para Pinky Pet',
        text: `Hola:\n\nHemos recibido una solicitud para cambiar la contraseña de tu cuenta de Pinky Pet.\n\nPara crear una contraseña nueva, abre este enlace (caduca en 1 hora):\n${link}\n\nSi no lo has pedido tú, ignora este correo: tu contraseña no cambiará.\n\nPinky Pet`,
        html: `<p>Hola:</p><p>Hemos recibido una solicitud para cambiar la contraseña de tu cuenta de Pinky Pet.</p><p><a href="${link}">Crear una contraseña nueva</a> (el enlace caduca en 1 hora).</p><p>Si no lo has pedido tú, ignora este correo: tu contraseña no cambiará.</p><p>Pinky Pet</p>`,
      });
    } catch (e) {
      // No se revela el fallo a quien lo pide (misma respuesta siempre); queda en el registro del servidor.
      this.logger.error(`No se pudo enviar el correo de recuperación: ${(e as Error).message}`);
    }
  }

  /** Comprueba el enlace sin usarlo (para mostrar «Este enlace ya no sirve» nada más abrirlo). */
  async check(raw: string): Promise<void> {
    if (!(await this.find(raw))) throw Errors.resetTokenInvalid();
  }

  /** Cambia la contraseña, gasta el enlace y cierra todas las sesiones abiertas de la cuenta. */
  async reset(raw: string, password: string): Promise<void> {
    const doc = await this.find(raw);
    if (!doc) throw Errors.resetTokenInvalid();
    const used = await this.resets.updateOne({ _id: doc._id, usedAt: null }, { usedAt: new Date() });
    if (used.modifiedCount !== 1) throw Errors.resetTokenInvalid(); // dos envíos a la vez: solo vale uno
    await this.users.updateOne({ _id: doc.userId }, { passwordHash: await argon2.hash(password, { type: argon2.argon2id }) });
    await this.tokens.updateMany({ userId: doc.userId, revokedAt: null }, { revokedAt: new Date() });
  }

  private async find(raw: string): Promise<PasswordResetDocument | null> {
    const [id, secret] = (raw ?? '').split('.');
    if (!id || !secret || !Types.ObjectId.isValid(id)) return null;
    const doc = await this.resets.findById(id);
    if (!doc || doc.usedAt || doc.expiresAt <= new Date()) return null;
    const a = Buffer.from(doc.secretHash);
    const b = Buffer.from(this.hmac(secret));
    return a.length === b.length && timingSafeEqual(a, b) ? doc : null;
  }

  private hmac(secret: string): string {
    return createHmac('sha256', this.env.jwtRefreshSecret).update(`reset:${secret}`).digest('hex');
  }
}
