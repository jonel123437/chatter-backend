import { User as UserEntity } from '../entities/user.entity';
import { UserDocument } from '../../../users/user.schema';
import { Types } from 'mongoose';
import { DEFAULT_PROFILE_PICTURE, DEFAULT_COVER_PICTURE } from '../../shared/constants/defaults';

export class UserMapper {
  static toDomain(userDoc: UserDocument | null): UserEntity | null {
    if (!userDoc) return null;

    const doc = userDoc as UserDocument & {
      profilePicture?: string;
      coverPicture?: string;
      coverPhoto?: string; // legacy fallback
    };

    return new UserEntity(
      (doc._id as Types.ObjectId).toString(),
      doc.name,
      doc.email,
      doc.password,
      doc.profilePicture || DEFAULT_PROFILE_PICTURE,   // ✅ strictly profile
      doc.coverPicture || doc.coverPhoto || DEFAULT_COVER_PICTURE, // ✅ strictly cover
      doc.createdAt,
      doc.updatedAt,
    );
  }
}
