import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as argon2 from 'argon2';
import { createHmac, randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';
import { Model, Types } from 'mongoose';
import { Errors } from '../common/errors';
import { ENV, Env } from '../config/env';
import { User, UserDocument } from '../users/user.schema';
import { GoogleVerifier } from './google-verifier';
import { RefreshToken, RefreshTokenDocument } from './refresh-token.schema';
import { SessionView, UserView } from './auth.dto';

export interface AccessPayload {
  sub: string;
}

@Injectable()
export class AuthService {
  /** Hash de una contraseña cualquiera: se usa para que «correo inexistente» tarde lo mismo que «contraseña mala». */
  private dummyHash: Promise<string> = argon2.hash('pinky-pet-dummy-password');

  constructor(
    @Inject(ENV) private readonly env: Env,
    private readonly jwt: JwtService,
    @InjectModel(User.name) private readonly users: Model<UserDocument>,
    @InjectModel(RefreshToken.name) private readonly tokens: Model<RefreshTokenDocument>,
    private readonly google: GoogleVerifier,
  ) {}

  static toView(u: UserDocument): UserView {
    return { id: u.id as string, email: u.email, hasTest: u.answers != null };
  }

  async register(email: string, password: string): Promise<SessionView> {
    const normalized = email.trim().toLowerCase();
    if (await this.users.exists({ email: normalized })) throw Errors.emailTaken();
    try {
      const user = await this.users.create({ email: normalized, passwordHash: await argon2.hash(password, { type: argon2.argon2id }) });
      return this.startSession(user);
    } catch (e) {
      // Dos registros simultáneos con el mismo correo: gana el índice único.
      if ((e as { code?: number }).code === 11000) throw Errors.emailTaken();
      throw e;
    }
  }

  async login(email: string, password: string): Promise<SessionView> {
    const user = await this.users.findOne({ email: email.trim().toLowerCase() });
    const ok = user
      ? await argon2.verify(user.passwordHash, password)
      : (await argon2.verify(await this.dummyHash, password), false);
    if (!user || !ok) throw Errors.invalidCredentials();
    return this.startSession(user);
  }

  /**
   * «Continuar con Google». Si ya hay una cuenta con ese correo (con contraseña), se entra en esa misma cuenta:
   * Google garantiza que el correo es de quien inicia sesión. Si no, se crea una cuenta nueva sin contraseña utilizable.
   */
  async loginWithGoogle(idToken: string): Promise<SessionView & { created: boolean }> {
    if (!this.env.googleClientIds.length) throw Errors.googleNotConfigured();
    const g = await this.google.verify(idToken);
    if (!g) throw Errors.googleInvalid();
    const email = g.email.trim().toLowerCase();
    let user = await this.users.findOne({ $or: [{ googleSub: g.sub }, { email }] });
    let created = false;
    if (!user) {
      const unusable = await argon2.hash(randomBytes(32).toString('base64url'), { type: argon2.argon2id });
      try {
        user = await this.users.create({ email, passwordHash: unusable, googleSub: g.sub });
        created = true;
      } catch (e) {
        if ((e as { code?: number }).code !== 11000) throw e;
        user = await this.users.findOne({ email });
        if (!user) throw e;
      }
    } else if (!user.googleSub) {
      user.googleSub = g.sub;
      await user.save();
    }
    return { ...(await this.startSession(user)), created };
  }

  /** Rota el token: el usado queda revocado y se entrega uno nuevo de la misma familia. */
  async refresh(raw: string): Promise<SessionView> {
    const token = await this.findToken(raw);
    if (!token) throw Errors.refreshInvalid();
    if (token.revokedAt) {
      // Alguien usa un token ya rotado: puede ser un robo. Se cierra toda esa sesión.
      await this.tokens.updateMany({ family: token.family, revokedAt: null }, { revokedAt: new Date() });
      throw Errors.refreshInvalid();
    }
    if (token.expiresAt <= new Date()) throw Errors.refreshInvalid();
    const revoked = await this.tokens.updateOne({ _id: token._id, revokedAt: null }, { revokedAt: new Date() });
    if (revoked.modifiedCount !== 1) throw Errors.refreshInvalid(); // otra petición lo rotó a la vez
    const user = await this.users.findById(token.userId);
    if (!user) throw Errors.refreshInvalid();
    return this.issue(user, token.family);
  }

  /** Cierra la sesión de este token (toda su familia). No falla si el token ya no vale. */
  async logout(raw: string): Promise<void> {
    const token = await this.findToken(raw);
    if (token) await this.tokens.updateMany({ family: token.family, revokedAt: null }, { revokedAt: new Date() });
  }

  async verifyAccess(bearer: string): Promise<AccessPayload> {
    try {
      return await this.jwt.verifyAsync<AccessPayload>(bearer);
    } catch {
      throw Errors.unauthorized();
    }
  }

  private startSession(user: UserDocument): Promise<SessionView> {
    return this.issue(user, randomUUID());
  }

  private async issue(user: UserDocument, family: string): Promise<SessionView> {
    const secret = randomBytes(32).toString('base64url');
    const doc = await this.tokens.create({
      userId: user._id,
      family,
      secretHash: this.hmac(secret),
      expiresAt: new Date(Date.now() + this.env.refreshTtlDays * 86_400_000),
    });
    const accessToken = await this.jwt.signAsync({ sub: user.id } satisfies AccessPayload);
    return { accessToken, expiresIn: this.env.accessTtlSeconds, refreshToken: `${doc.id}.${secret}`, user: AuthService.toView(user) };
  }

  private async findToken(raw: string): Promise<RefreshTokenDocument | null> {
    const [id, secret] = raw.split('.');
    if (!id || !secret || !Types.ObjectId.isValid(id)) return null;
    const token = await this.tokens.findById(id);
    if (!token) return null;
    const a = Buffer.from(token.secretHash);
    const b = Buffer.from(this.hmac(secret));
    return a.length === b.length && timingSafeEqual(a, b) ? token : null;
  }

  private hmac(secret: string): string {
    return createHmac('sha256', this.env.jwtRefreshSecret).update(secret).digest('hex');
  }
}
