// src/domain/auth/services/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/user.service';
import { LoginDto } from '../dtos/login.dto';
import { UserMapper } from '../../users/mappers/user.mapper';
import bcrypt from 'node_modules/bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async login(dto: LoginDto) {
    const userDoc = await this.usersService.findOneByEmail(dto.email);
    if (!userDoc) throw new UnauthorizedException('Invalid credentials');

    const isValid = await bcrypt.compare(dto.password, userDoc.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    const domainUser = UserMapper.toDomain(userDoc)!;

    const payload = { sub: domainUser.id, email: domainUser.email };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: domainUser,
    };
  }

}
