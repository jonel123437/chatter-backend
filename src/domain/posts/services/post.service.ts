import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../entities/post.entity'; 
import { CreatePostDto } from '../dtos/create-post.dto';
import { mapPostToDto } from '../mappers/post.mapper';
import { PostResponseDto } from '../dtos/post-response.dto';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async createPost(dto: CreatePostDto & { authorId: string }): Promise<PostResponseDto> {
    const newPost = new this.postModel(dto);
    await newPost.save();

    const populatedPost = await this.postModel
      .findById(newPost._id)
      .populate('authorId', 'name profilePicture')
      .exec();

    if (!populatedPost) throw new Error('Post not found after creation');

    return mapPostToDto(populatedPost);
  }


  async getPosts(): Promise<PostResponseDto[]> {
    const posts = await this.postModel
      .find()
      .populate('authorId', 'name profilePicture')
      .sort({ createdAt: -1 })
      .exec();

    return posts.map(mapPostToDto);
  }

  async getPostsByUser(userId: string, currentUserId?: string): Promise<PostResponseDto[]> {
    const filter: any = { authorId: userId };
    if (currentUserId !== userId) filter.visibility = 'public';

    const posts = await this.postModel
      .find(filter)
      .populate('authorId', 'name profilePicture')
      .sort({ createdAt: -1 })
      .exec();

    return posts.map(mapPostToDto);
  }

  async getPublicPosts(): Promise<PostResponseDto[]> {
    const posts = await this.postModel
      .find({ visibility: 'public' })
      .populate('authorId', 'name profilePicture')
      .sort({ createdAt: -1 })
      .exec();

    return posts.map(mapPostToDto);
  }
}
