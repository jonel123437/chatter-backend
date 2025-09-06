// src/domain/users/dtos/friend-request.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class FriendRequestDto {
  @ApiProperty({ description: 'ID of the target user' })
  friendId: string;
}