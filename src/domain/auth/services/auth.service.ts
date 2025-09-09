// src/domain/auth/services/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/user.service';
import { LoginDto } from '../dtos/login.dto';
import { UserMapper } from '../../users/mappers/user.mapper';
import bcrypt from 'bcryptjs';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  // Email/password login
  async login(dto: LoginDto) {
    const userDoc = await this.usersService.findOneByEmail(dto.email);
    if (!userDoc) throw new UnauthorizedException('Invalid credentials');

    if (!userDoc.password) {
      throw new UnauthorizedException('Password login not available for this user');
    }

    const isValid = await bcrypt.compare(dto.password, userDoc.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    const domainUser = UserMapper.toDomain(userDoc)!;
    const payload = { sub: domainUser.id, email: domainUser.email };
    const token = this.jwtService.sign(payload);

    return { access_token: token, user: domainUser };
  }

  // OAuth login (Google)
  async validateOAuthLogin(oauthUser: {
    name: string;
    email?: string;       // optional
    picture?: string;
  }): Promise<{ access_token: string; user: User }> {

    // Generate a fake email if missing to satisfy Mongoose unique constraint
    const email = oauthUser.email ?? `user-${Date.now()}@local.fake`;

    // Check if user already exists
    let existingUserDoc = await this.usersService.findOneByEmail(email);

    let domainUser: User;

    if (!existingUserDoc) {
      domainUser = await this.usersService.createFromOAuth({
        ...oauthUser,
        email, // ensure email is set
      });
    } else {
      domainUser = UserMapper.toDomain(existingUserDoc)!;
    }

    const payload = { sub: domainUser.id, email: domainUser.email };
    const token = this.jwtService.sign(payload);

    return { access_token: token, user: domainUser };
  }
}
