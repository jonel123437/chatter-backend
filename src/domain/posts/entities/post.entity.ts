// post.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/entities/user.entity';

export type PostDocument = Post & Document & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  authorId: Types.ObjectId | User;

  @Prop({
    required: true,
    enum: ['public', 'friends', 'only_me'],
    default: 'public',
  })
  visibility: 'public' | 'friends' | 'only_me';
}

export const PostSchema = SchemaFactory.createForClass(Post);
