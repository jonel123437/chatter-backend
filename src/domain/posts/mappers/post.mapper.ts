import { PostResponseDto } from '../dtos/post-response.dto';
import { PostDocument } from '../entities/post.entity';

export const mapPostToDto = (post: PostDocument & { authorId?: any }): PostResponseDto => ({
  content: post.content,
  authorId: post.authorId
    ? {
        _id: post.authorId._id?.toString() || 'unknown',
        name: post.authorId.name || 'Unknown',
        profilePicture: post.authorId.profilePicture || '/static/avatar.png',
      }
    : {
        _id: 'unknown',
        name: 'Unknown',
        profilePicture: '/static/avatar.png',
      },
  visibility: post.visibility,
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
});
