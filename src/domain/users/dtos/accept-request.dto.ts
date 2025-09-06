// src/domain/users/dtos/accept-request.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class AcceptRequestDto {
  @ApiProperty({ description: 'ID of the user who sent the request' })
  requesterId: string;
}