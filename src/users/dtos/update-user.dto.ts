import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator'

export class UpdateUserDto {
  @IsEmail()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @IsOptional()
  email: string

  @IsString()
  @MinLength(5)
  @MaxLength(30)
  @IsOptional()
  password: string
}
