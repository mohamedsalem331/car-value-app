import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common'
import { CreateUserDto } from './dtos'
import { User } from './entities/users.entity'
import { UsersService } from './users.service'
import { validatePassword } from '../utils/crypt.util'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(userData: CreateUserDto): Promise<User> {
    const user = await this.usersService.findUserByEmail(userData.email)

    if (user) throw new ConflictException('Email is Used')

    return this.usersService.create(userData)
  }

  async signIn(userData: CreateUserDto): Promise<{ access_token: string }> {
    // const payload = { username: userData.username, sub: userData.userId }
    const user = await this.usersService.findUserByEmail(userData.email)

    if (!user) throw new NotFoundException('User Not Found')

    const isValidPassword = await validatePassword(
      userData.password,
      user.password,
    )

    if (!isValidPassword) throw new UnauthorizedException('Password Incorrect')

    const token = this.jwtService.sign({ email: userData.email })

    return { ...user, access_token: token }
  }

  validateUser(userData: { email: string }) {
    return this.usersService.findUserByEmail(userData.email)
  }

  // public generateJWT(user) {
  //   let today = new Date();
  //   let exp = new Date(today);
  //   exp.setDate(today.getDate() + 60);

  //   return jwt.sign({
  //     id: user.id,
  //     username: user.username,
  //     email: user.email,
  //     exp: exp.getTime() / 1000,
  //   }, SECRET);
  // };
}
