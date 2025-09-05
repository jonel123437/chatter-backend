import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './controllers/user.controller';
import { UsersService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { User } from './entities/user.entity';
import { UserSchema } from '../../users/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService, UserRepository],  
})
export class UsersModule {}
