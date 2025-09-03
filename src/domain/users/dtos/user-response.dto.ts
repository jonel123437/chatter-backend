import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;

  constructor(user: User) {
    this.id = (user as any)._id?.toString();
    this.name = user.name;
    this.email = user.email;
    this.role = user.role;
  }
}
