import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { DEFAULT_PROFILE_PICTURE, DEFAULT_COVER_PICTURE } from '../domain/shared/constants/defaults';

export type UserDocument = User & Document & { 
  validatePassword(password: string): Promise<boolean>;
  createdAt?: Date;
  updatedAt?: Date;
};

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
}

export const UserSchema = SchemaFactory.createForClass(User);

// Instance method
UserSchema.methods.validatePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};
