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

  @Prop({ required: true })
  password: string;

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

// src/domain/users/schemas/user.schema.ts
export type UserDocument = Document<unknown, {}, User> &
  User & {
    _id: Types.ObjectId; // 👈 Explicitly type _id
    validatePassword(password: string): Promise<boolean>;
    createdAt: Date;
    updatedAt: Date;
  };


export const UserSchema = SchemaFactory.createForClass(User);

// ✅ Instance method
UserSchema.methods.validatePassword = async function (
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};
