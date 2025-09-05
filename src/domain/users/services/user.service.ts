import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserDocument } from '../../../users/user.schema';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserMapper } from '../mappers/user.mapper';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user.repository';
import { UpdateUserImagesDto } from '../dtos/update-user-images.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepo: UserRepository) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Mongoose will automatically apply default profile and cover pictures
    const createdUser = await this.userRepo.create({
      ...dto,
      password: hashedPassword,
    } as any);

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
    const userDocs = await this.userRepo.searchUsers(query);
    return userDocs.map(doc => UserMapper.toDomain(doc)!);
  }

  async updateImages(userId: string, dto: UpdateUserImagesDto): Promise<User> {
    const userDoc = await this.userRepo.findById(userId);
    if (!userDoc) {
      throw new Error('User not found');
    }

    if (dto.profilePicture) userDoc.profilePicture = dto.profilePicture;
    if (dto.coverPicture) userDoc.coverPicture = dto.coverPicture;

    const updatedUser = await userDoc.save();
    return UserMapper.toDomain(updatedUser)!;
  }

}
