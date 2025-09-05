import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity'; 
import { UserDocument } from '../../../users/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(dto: CreateUserDto): Promise<UserDocument> {
    const newUser = new this.userModel(dto);
    return newUser.save();
  }

  async findOneByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async searchUsers(query: string): Promise<UserDocument[]> {
    return this.userModel
      .find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
        ],
      })
      .exec();
  }
}
