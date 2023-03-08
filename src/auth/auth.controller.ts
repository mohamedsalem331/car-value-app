import { Body, Controller, Post, UseInterceptors } from '@nestjs/common'
import {
  Delete,
  Get,
  Patch,
} from '@nestjs/common/decorators/http/request-mapping.decorator'
import {
  Param,
  Query,
} from '@nestjs/common/decorators/http/route-params.decorator'
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor'
import { AuthService } from './auth.service'
import { CreateUserDto } from './dtos/auth.dto'
import { UpdateUserDto } from './dtos/update-user.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body()
    body: CreateUserDto,
  ) {
    return this.authService.signUp(body.email, body.password)
  }

  @UseInterceptors(SerializeInterceptor)
  @Get('/:id')
  findUser(@Param('id') id: string) {
    return this.authService.findUserById(parseInt(id))
  }

  @Get()
  findAll(
    @Query('email')
    email: string,
  ) {
    return this.authService.findUserByEmail(email)
  }

  @Patch('/:id')
  updateUser(@Body() userDto: UpdateUserDto, @Param('id') id: string) {
    return this.authService.updateUserById(parseInt(id), userDto)
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.authService.deleteUserById(parseInt(id))
  }

  //   @Post('/signin')
  //   signIn(@Body() authCredentialsDto: AuthCredentialsDto) {
  //     return this.authService.signIn(authCredentialsDto)
  //   }
}
