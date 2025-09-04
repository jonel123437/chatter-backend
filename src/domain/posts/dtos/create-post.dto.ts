import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ description: 'Content of the post' })
  content: string;

  @ApiProperty({
    description: 'Visibility of the post',
    enum: ['public', 'friends', 'only_me'],
    default: 'public',
  })
  visibility: 'public' | 'friends' | 'only_me';
}
