// src/domain/posts/entities/post.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  authorId: string;

  @Prop({ required: true, enum: ['public', 'friends', 'only_me'], default: 'public' })
  visibility: 'public' | 'friends' | 'only_me';
}

export const PostSchema = SchemaFactory.createForClass(Post);
