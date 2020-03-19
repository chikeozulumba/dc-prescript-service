import { Injectable, ConflictException, HttpStatus, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { pick } from 'lodash';
import { sign, SignOptions, verify } from 'jsonwebtoken';
import { v4 as UUID } from 'uuid';
import { User } from './user';
import { CreateUserDto, LoginUserDto } from './user.dto';
import { randomBytes } from 'crypto';
import { ExtractJwt } from 'passport-jwt';
import { ComparePassword } from '../shared/password/index';

@Injectable()
export class UserService {
  private readonly jwtOptions: SignOptions;
  private readonly jwtKey: string = process.env.JWT_SECRET;
  private refreshTokenTtl: number;
  private expiresInDefault: number;
  private usersExpired = [];

  constructor(@InjectModel('User') private UserModel: Model<User>) {
    this.expiresInDefault = parseInt(process.env.JWT_ACCESS_TOKEN_TTL, 10);
    this.refreshTokenTtl = parseInt(process.env.JWT_REFRESH_TOKEN_TTL, 10);
    this.jwtOptions = { expiresIn: this.expiresInDefault };
    this.jwtKey = process.env.JWT_SECRET;
  }

  async findUser(param: CreateUserDto) {
    return await this.UserModel.findOne(param);
  }

  async registerNewUser(user: CreateUserDto) {
    const getUser = await this.findUser(pick(user, ['email']));
    if (getUser) {
      throw new ConflictException({
        message: `${getUser.email} already in use`,
        statusCode: HttpStatus.CONFLICT,
      });
    }
    const newUser = new this.UserModel(user);
    return newUser.save();
  }

  async loginUser(user: LoginUserDto) {
    const getUser = await this.findUser(pick(user, ['email']));
    if (!getUser) {
      throw new NotFoundException({
        message: 'Invalid login credentials',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
    const verifiedUser = this.validateUser(user, getUser);
    if (!verifiedUser) {
      throw new NotFoundException({
        message: 'Invalid login credentials',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
    console.log(this.createAccessToken(verifiedUser));
    return {
      ...this.createAccessToken(verifiedUser),
      user: pick(verifiedUser, ['_id', 'fullName', 'email']),
    };
  }

  validateUser(payload: LoginUserDto, user: Model<User>): Promise<any> {
    if (ComparePassword(payload.password, user.password)) {
      return pick(user, ['_id', 'fullName', 'email']);
    }
    return null;
  }

  // async validatePayload(payload: any | any): Promise<any> {
  //   console.log(payload);
  //   const token =
  //     ExtractJwt.fromAuthHeaderAsBearerToken()(payload) ||
  //     ExtractJwt.fromUrlQueryParameter('access_token')(payload);
  //   const tokenBlacklisted = await this.isBlackListed(payload.sub, payload.exp);
  //   if (!tokenBlacklisted) {
  //     const result = await this.decodeAndValidateJWT(token);
  //     return {
  //       id: result.sub,
  //       role: result.role,
  //       email: result.email,
  //     };
  //   }
  //   return null;
  // }

  async validatePayload(payload: any | any): Promise<any> {
    const user = await this.findUser(pick(payload, ['email']));
    return !user ? null : pick(user, ['_id', 'email', 'fullName', 'createdAt', 'updatedAt'])
  }

  async decodeAndValidateJWT(token: string): Promise<any> {
    if (token) {
      try {
        const payload = await this.validateToken(token);
        return payload;
      } catch (error) {
        throw new UnauthorizedException('Unauthorized.');
      }
    }
  }

  private async validateToken(
    token: string,
    ignoreExpiration: boolean = false,
  ): Promise<any> {
    return verify(token, this.jwtKey, {
      ignoreExpiration,
    }) as any;
  }

  createAccessToken(payload: any, expires = this.expiresInDefault): any {
    const options = this.jwtOptions;
    expires > 0 ? (options.expiresIn = expires) : delete options.expiresIn;
    options.jwtid = UUID();
    const signedPayload = sign(payload, this.jwtKey, options);
    return {
      accessToken: signedPayload,
      expiresIn: expires,
    };
  }

  private async isBlackListed(id: string, expire: number): Promise<boolean> {
    return this.usersExpired[id] && expire < this.usersExpired[id];
  }
}
