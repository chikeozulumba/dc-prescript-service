import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    // private jwtService: JwtService,
  ) {}

  async signJWT(payload: any) {
    return {
      ...payload,
      accessToken: 'this.jwtService.sign(payload)',
    };
  }
  
}
