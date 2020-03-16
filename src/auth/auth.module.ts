import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import UserModel from 'src/user/user.model';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '72hrs' },
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserModel }]),
  ],
  providers: [AuthService, UserService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
