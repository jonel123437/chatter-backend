import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(dto: CreateUserDto): Promise<UserDocument> {
    try {
      const createdUser = new this.userModel(dto);
      return await createdUser.save();
    } catch (error) {
      console.error('Error creating user:', error); // 👈 add this
      throw error;
    }
  }


  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }
}
