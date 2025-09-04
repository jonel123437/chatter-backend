import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../entities/post.entity';
import { CreatePostDto } from '../dtos/create-post.dto';

interface PostWithAuthorDto extends CreatePostDto {
  authorId: string;
}

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async createPost(dto: CreatePostDto & { authorId: string }): Promise<Post> {
    const newPost = new this.postModel(dto);
    return newPost.save();
  }

  async getPosts() {
    return this.postModel.find().sort({ createdAt: -1 }).exec();
  }

  async getPostsForUser(userId: string, friendsIds: string[] = []): Promise<Post[]> {
    // userId = current logged-in user
    return this.postModel.find({
      $or: [
        { visibility: 'public' },                          // public posts
        { visibility: 'friends', authorId: { $in: friendsIds } }, // friends posts
        { authorId: userId },                               // their own posts (all visibility)
      ],
    }).exec();
  }

}
