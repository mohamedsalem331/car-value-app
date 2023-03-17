import { Test, TestingModule } from '@nestjs/testing'
import * as cryptUtil from '../utils/crypt.util'
import { AuthService } from './auth.service'
import { UsersController } from './users.controller'
import { User } from './entities/users.entity'
import { UsersService } from './users.service'
import { JwtStrategy } from './jwt.strategy'
import { JwtModule } from '@nestjs/jwt'

describe('AuthService', () => {
  let service: AuthService
  let mockUserService: Partial<UsersService>

  beforeEach(async () => {
    const users = []

    mockUserService = {
      findUserByEmail: (email) => {
        return Promise.resolve(users.find((usr) => usr.email === email))
      },
      create: (email: string, password: string) => {
        const newUser = {
          id: Math.floor(Math.random() * 9999),
          email,
          password,
        }

        users.push(newUser)

        return Promise.resolve(newUser as User)
      },
    }

    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'very secret key' })],
      controllers: [UsersController],
      providers: [
        AuthService,
        JwtStrategy,
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile()

    service = module.get(AuthService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should create new user with hashed password ', async () => {
    const userResult = { email: 'testfdss15@gmail.com', password: '54543' }

    const user = await service.signUp(userResult)

    expect(user.password).toEqual(userResult.password)
  })

  it('should throws an error if user sign up with already used email', async () => {
    const userObjMock = { email: 'test@gmail.com', password: 'test1234' }

    await service.signUp(userObjMock)

    await expect(service.signUp(userObjMock)).rejects.toThrowError(
      'Email is Used',
    )
  })

  it('should throws an error if userdto has invalid email', async () => {
    const userObjMock = { email: 'test@gmail.com', password: 'test1234' }

    await expect(service.signIn(userObjMock)).rejects.toThrowError(
      'User Not Found',
    )
  })

  it('should throws an error if userdto has invalid password', async () => {
    const userObjMock = { email: 'test@gmail.com', password: 'test1234' }

    await service.signUp(userObjMock)

    await expect(
      service.signIn({ ...userObjMock, password: '' }),
    ).rejects.toThrowError('Password Incorrect')
  })

  it('should return user if correct email and password validated', async () => {
    const userObjMock = { email: 'test@gmail.com', password: 'test1234' }

    await service.signUp(userObjMock)

    jest.spyOn(cryptUtil, 'validatePassword').mockResolvedValue(true)

    const user = await service.signIn(userObjMock)

    expect(user).toBeDefined()
  })
})
