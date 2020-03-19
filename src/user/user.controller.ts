import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { JoiValidationPipe } from '../shared/pipes/joi-validation.pipe';
import { registerationSchema, loginSchema } from './user.validation';
import { UserService } from './user.service';
import { CreateUserDto, LoginUserDto } from './user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async RegisterUser(
    @Body(new JoiValidationPipe(registerationSchema)) body: CreateUserDto,
  ) {
    const response = await this.UserService.registerNewUser(body);
    return response;
  }

  @Post('login')
  @HttpCode(HttpStatus.ACCEPTED)
  async LoginUser(
    @Body(new JoiValidationPipe(loginSchema)) body: LoginUserDto,
  ) {
    const response = await this.UserService.loginUser(body);
    return response;
  }
}
