import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../entities/user.entity';
import { UserDocument } from '../../../users/user.schema';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserMapper } from '../mappers/user.mapper';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    // hash the password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // create new user without role, with hashed password
    const createdUser = new this.userModel({
      ...dto,
      password: hashedPassword,
    });

    const savedUser = await createdUser.save();
    return UserMapper.toDomain(savedUser)!;
  }

  async findById(id: string): Promise<User | null> {
    const userDoc = await this.userModel.findById(id).exec();
    return UserMapper.toDomain(userDoc);
  }

  async findOneByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }
}
