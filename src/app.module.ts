import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './domain/auth/auth.module';
import { UsersModule } from './domain/users/users.module';

@Module({
  imports: [
    // Load .env globally
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Use .env for MongoDB connection
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017', {
      dbName: process.env.MONGODB_DB || 'chatter_db',
    }),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
