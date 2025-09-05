import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../entities/user.entity';
import { UserDocument } from '../../../users/user.schema';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserMapper } from '../mappers/user.mapper';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepo: UserRepository) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const createdUser = await this.userRepo.create({
      ...dto,
      password: hashedPassword,
    } as any); // cast dto to match UserDocument
    return UserMapper.toDomain(createdUser)!;
  }

  async findById(id: string): Promise<User | null> {
    const userDoc = await this.userRepo.findById(id);
    return UserMapper.toDomain(userDoc);
  }

  async findOneByEmail(email: string): Promise<UserDocument | null> {
    return this.userRepo.findOneByEmail(email);
  }

  async searchUsers(query: string): Promise<User[]> {
    console.log('Searching users for query:', query);
    const userDocs = await this.userRepo.searchUsers(query);
    console.log('Found documents:', userDocs);
    return userDocs.map(doc => {
      const user = UserMapper.toDomain(doc);
      console.log('Mapped user:', user);
      return user!;
    });
  }

}
