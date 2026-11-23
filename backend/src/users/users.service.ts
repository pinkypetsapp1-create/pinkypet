import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import type { Answers } from '../compatibility/questions';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly users: Model<UserDocument>) {}

  findById(id: string): Promise<UserDocument | null> {
    return Types.ObjectId.isValid(id) ? this.users.findById(id) : Promise.resolve(null);
  }

  async saveAnswers(id: string, answers: Answers): Promise<UserDocument | null> {
    return this.users.findByIdAndUpdate(id, { answers, answeredAt: new Date() }, { new: true });
  }
}
