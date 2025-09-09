import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Jonel Escaran' })
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'jonel@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  // Password is optional to support OAuth users
  @ApiPropertyOptional({ example: 'Password123!' })
  @IsOptional()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({ example: 'USER' })
  @IsOptional()
  role?: string;

  @ApiPropertyOptional({ example: 'https://example.com/profile.jpg' })
  @IsOptional()
  @IsUrl()
  profilePicture?: string;

  @ApiPropertyOptional({ example: 'https://example.com/cover.jpg' })
  @IsOptional()
  @IsUrl()
  coverPicture?: string;
}
