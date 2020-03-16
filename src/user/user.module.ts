import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import UserModel from './user.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserModel }]),
  ],
  controllers: [UserController],
  providers: [UserService, AuthService]
})
export class UserModule {}
