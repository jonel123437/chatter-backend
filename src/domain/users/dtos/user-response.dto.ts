import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false })
  profilePicture?: string;

  @ApiProperty({ required: false })
  coverPicture?: string;

  @ApiProperty({ required: false })
  createdAt?: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;

  @ApiProperty({
    type: [String],
    required: false,
    description: 'List of confirmed friend user IDs',
  })
  friends: string[];

  @ApiProperty({
    type: [String],
    required: false,
    description: 'List of pending friend request user IDs',
  })
  friendRequests: string[];

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.profilePicture = user.profilePicture;
    this.coverPicture = user.coverPicture;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.friends = user.friends || [];
    this.friendRequests = user.friendRequests || []; // 👈 add this
  }
}
