export class PostResponseDto {
  content: string;

  authorId: {
    _id: string;
    name: string;
    avatarUrl?: string;
  };

  visibility: 'public' | 'friends' | 'only_me';
  createdAt: Date;
  updatedAt: Date;
}
