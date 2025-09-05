import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../entities/post.entity';
import { CreatePostDto } from '../dtos/create-post.dto';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async createPost(dto: CreatePostDto & { authorId: string }): Promise<Post> {
    const newPost = new this.postModel(dto);
    await newPost.save();

    // populate authorId before returning
    const populatedPost = await this.postModel
      .findById(newPost._id)
      .populate('authorId', 'name avatarUrl')
      .exec();

    if (!populatedPost) throw new Error('Post not found after creation');

    return populatedPost;
  }

  async getPosts(): Promise<Post[]> {
    return this.postModel
      .find()
      .populate('authorId', 'name avatarUrl')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getPostsByUser(userId: string, currentUserId?: string): Promise<Post[]> {
    const filter: any = { authorId: userId };

    // If the current user is NOT the owner, only return public posts
    if (currentUserId !== userId) {
      filter.visibility = 'public';
    }

    return this.postModel
      .find(filter)
      .populate('authorId', 'name avatarUrl')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getPublicPosts(): Promise<Post[]> {
    return this.postModel
      .find({ visibility: 'public' })
      .populate('authorId', 'name avatarUrl')
      .sort({ createdAt: -1 })
      .exec();
  }
}
