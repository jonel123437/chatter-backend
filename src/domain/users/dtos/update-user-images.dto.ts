import { IsOptional, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserImagesDto {
  @ApiPropertyOptional({ example: '/uploads/profile/123.jpg', description: 'New profile picture URL' })
  @IsOptional()
  @IsUrl()
  profilePicture?: string;

  @ApiPropertyOptional({ example: '/uploads/cover/123.jpg', description: 'New cover picture URL' })
  @IsOptional()
  @IsUrl()
  coverPicture?: string;
}
