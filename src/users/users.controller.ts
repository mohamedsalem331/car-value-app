import {
  Body,
  Controller,
  Post,
  Patch,
  Get,
  Delete,
  Param,
  Query,
  Session,
  UseGuards,
  NotFoundException,
  BadRequestException,
  Res,
  Req,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Response, Request } from 'express'
import { Serialize } from '../common/interceptors/serialize.interceptor'
import { UsersService } from './users.service'
import { UserDto, CreateUserDto } from './dtos'
import { AuthService } from './auth.service'
import { User } from './entities/users.entity'
import { AuthGuard } from '@nestjs/passport'

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  private readonly logger = new Logger(UsersController.name)

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  signUp(@Body() body: CreateUserDto): Promise<User> {
    this.logger.verbose('New User Created ' + JSON.stringify(body))

    return this.authService.signUp(body)
  }

  @Post('/signin')
  async signIn(
    @Res({ passthrough: true }) res: Response,
    @Body() body: CreateUserDto,
  ): Promise<{ access_token: string }> {
    const { access_token } = await this.authService.signIn(body)

    const expireTime = new Date()
    expireTime.setMinutes(expireTime.getMinutes() + 15)

    this.logger.verbose(
      'User Authenticated ' + JSON.stringify({ access_token }),
    )

    res.cookie('auth-cookie', access_token, {
      expires: expireTime,
      httpOnly: true,
    })

    return { access_token }
  }

  @Post('/signout')
  @UseGuards(AuthGuard('jwt'))
  async signOut(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.logger.log('User Logged Out ')

    res.cookie('auth-cookie', '', { expires: new Date() })

    return req.user
  }

  // user

  @Get()
  async findUser(
    @Query('email') email: string,
    @Query('id') id: string,
  ): Promise<User> {
    if (!id || !email)
      throw new BadRequestException('Invalid User query method')

    let user: User

    if (id) {
      user = await this.usersService.findUserById(parseInt(id))
    }

    if (email) {
      user = await this.usersService.findUserByEmail(email)
    }

    if (!user) throw new NotFoundException()

    return user
  }

  @Patch('/:id')
  updateUser(
    @Body() userDto: Partial<CreateUserDto>,
    @Param('id') id: string,
  ): Promise<User> {
    return this.usersService.updateUserById(parseInt(id), userDto)
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string): Promise<number> {
    return this.usersService.deleteUserById(parseInt(id))
  }
}
