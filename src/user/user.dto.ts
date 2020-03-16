// import { ApiModelProperty } from '@nestjs/swagger';

export class CreateUserDto {
  readonly fullName?: string;
  readonly email?: string;
  readonly password?: string;
}
export class LoginUserDto {
  readonly email: string;
  readonly password: string;
}