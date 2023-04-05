import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class UserDTO {
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  constructor(
    username?: string,
    password?: string,
    email?: string
  ) {
    this.username = username || '';
    this.password = password || '';
    this.email = email || '';
  }
}
