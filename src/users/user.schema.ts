import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { DEFAULT_PROFILE_PICTURE, DEFAULT_COVER_PICTURE } from '../domain/shared/constants/defaults';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  // Make password optional for OAuth users
  @Prop({ required: false })
  password?: string;

  @Prop({ default: DEFAULT_PROFILE_PICTURE })
  profilePicture: string;

  @Prop({ default: DEFAULT_COVER_PICTURE })
  coverPicture: string;

  // 👥 Pending friend requests (ObjectId references to User)
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  friendRequests: Types.ObjectId[];

  // 🤝 Confirmed friendships (ObjectId references to User)
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  friends: Types.ObjectId[];
}

// Type for UserDocument
export type UserDocument = Document<unknown, {}, User> &
  User & {
    _id: Types.ObjectId;
    validatePassword(password: string): Promise<boolean>;
    createdAt: Date;
    updatedAt: Date;
  };

export const UserSchema = SchemaFactory.createForClass(User);

// ✅ Instance method to validate password
UserSchema.methods.validatePassword = async function (
  password: string,
): Promise<boolean> {
  // If no password is set (OAuth user), always return false
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};
