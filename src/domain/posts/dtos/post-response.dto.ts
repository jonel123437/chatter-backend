import { ApiProperty } from '@nestjs/swagger';

export class PostAuthorDto {
  @ApiProperty({ description: 'Author ID' })
  _id: string;

  @ApiProperty({ description: 'Author name' })
  name: string;

  @ApiProperty({
    description: 'Profile picture URL of the author',
    required: false,
  })
  profilePicture?: string;
}

export class PostResponseDto {
  @ApiProperty({ description: 'Content of the post' })
  content: string;

  @ApiProperty({ type: PostAuthorDto, description: 'Author details' })
  authorId: PostAuthorDto;

  @ApiProperty({
    description: 'Visibility of the post',
    enum: ['public', 'friends', 'only_me'],
  })
  visibility: 'public' | 'friends' | 'only_me';

  @ApiProperty({ description: 'Post creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Post update timestamp' })
  updatedAt: Date;
}