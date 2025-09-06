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
    return userDocs.map((doc) => UserMapper.toDomain(doc)!);
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

  // ✅ Send friend request
  async sendFriendRequest(userId: string, friendId: string): Promise<User> {
    if (userId === friendId) throw new Error("You can't add yourself");

    const userDoc = await this.userRepo.findById(userId);
    const friendDoc = await this.userRepo.findById(friendId);

    if (!userDoc || !friendDoc) throw new Error('User not found');

    // Already friends
    if (userDoc.friends.some((f) => f.equals(friendDoc._id))) {
      throw new Error('Already friends');
    }

    // Already requested
    if (friendDoc.friendRequests.some((f) => f.equals(userDoc._id))) {
      throw new Error('Friend request already sent');
    }

    // Add friend request to the target user
    friendDoc.friendRequests.push(userDoc._id);
    await friendDoc.save();

    // Return the updated target user instead of current user
    return UserMapper.toDomain(friendDoc)!;
  }

  // ✅ Accept request
  async acceptFriendRequest(userId: string, requesterId: string): Promise<User> {
    const userDoc = await this.userRepo.findById(userId);
    const requesterDoc = await this.userRepo.findById(requesterId);

    if (!userDoc || !requesterDoc) throw new Error('User not found');

    const index = userDoc.friendRequests.findIndex((id) =>
      id.equals(requesterDoc._id),
    );
    if (index === -1) throw new Error('No friend request found');

    // Remove from requests
    userDoc.friendRequests.splice(index, 1);

    // Add to friends both ways
    userDoc.friends.push(requesterDoc._id);
    requesterDoc.friends.push(userDoc._id);

    await userDoc.save();
    await requesterDoc.save();

    return UserMapper.toDomain(userDoc)!;
  }

  // ✅ Reject request
  async rejectFriendRequest(userId: string, requesterId: string): Promise<User> {
    const userDoc = await this.userRepo.findById(userId);
    if (!userDoc) throw new Error('User not found');

    const index = userDoc.friendRequests.findIndex(
      (id) => id.toString() === requesterId,
    );
    if (index === -1) throw new Error('No friend request found');

    userDoc.friendRequests.splice(index, 1);
    await userDoc.save();

    return UserMapper.toDomain(userDoc)!;
  }

  // ✅ Unfriend
  async unfriend(userId: string, friendId: string): Promise<User> {
    const userDoc = await this.userRepo.findById(userId);
    const friendDoc = await this.userRepo.findById(friendId);

    if (!userDoc || !friendDoc) throw new Error('User not found');

    userDoc.friends = userDoc.friends.filter(
      (id) => !id.equals(friendDoc._id),
    );
    friendDoc.friends = friendDoc.friends.filter(
      (id) => !id.equals(userDoc._id),
    );

    await userDoc.save();
    await friendDoc.save();

    return UserMapper.toDomain(userDoc)!;
  }
}
