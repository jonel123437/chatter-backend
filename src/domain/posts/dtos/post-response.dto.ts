import { ApiProperty } from '@nestjs/swagger';

export class PostResponseDto {
  @ApiProperty()
  content: string;

  @ApiProperty()
  authorId: string;

  @ApiProperty()
  visibility: 'public' | 'friends' | 'only_me';

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
