import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/services/user.service';
import { LoginDto } from '../dtos/login.dto';
import { UserDocument } from '../../users/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async login(dto: LoginDto): Promise<Omit<UserDocument, 'password'> | null> {
    const user = await this.usersService.findOneByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await user.validatePassword(dto.password);
    if (!isValid) return null;

    const { password, ...result } = user as any;
    return result;
  }
}
