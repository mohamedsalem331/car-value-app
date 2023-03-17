import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator'

export class CreateUserDto {
  @IsEmail()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  email: string

  @IsString()
  @MinLength(5)
  @MaxLength(30)
  password: string
}
