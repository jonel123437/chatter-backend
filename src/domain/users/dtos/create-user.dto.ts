import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Jonel Escaran' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'jonel@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123!' })
  @MinLength(6)
  password: string;

  @IsOptional()
  role?: string; // optional

  @IsOptional()
  @IsUrl()
  profilePicture?: string; // optional, must be a valid URL if provided

  @IsOptional()
  @IsUrl()
  coverPicture?: string; // optional, must be a valid URL if provided
}
