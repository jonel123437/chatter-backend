import { PostResponseDto } from '../dtos/post-response.dto';
import { PostDocument } from '../entities/post.entity';

export const mapPostToDto = (post: PostDocument & { authorId: any }): PostResponseDto => ({
  content: post.content,
  authorId: {
    _id: post.authorId._id.toString(),
    name: post.authorId.name,
    profilePicture: post.authorId.profilePicture,
  },
  visibility: post.visibility,
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
});
