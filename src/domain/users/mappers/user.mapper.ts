import { User as UserEntity } from '../entities/user.entity';
import { UserDocument } from '../../../users/user.schema';
import { Types } from 'mongoose';

export class UserMapper {
  static toDomain(userDoc: UserDocument | null): UserEntity | null {
    if (!userDoc) return null;

    return new UserEntity(
      (userDoc._id as Types.ObjectId).toString(),
      userDoc.name,
      userDoc.email,
      userDoc.password,
      userDoc.createdAt, 
      userDoc.updatedAt, 
    );
  }
}
