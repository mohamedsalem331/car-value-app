import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { UsersController } from './users.controller'
import { User } from './entities/users.entity'
import { UsersService } from './users.service'

describe('UsersController', () => {
  let controller: UsersController
  let mockUserService: Partial<UsersService>
  let mockAuthService: Partial<AuthService>

  beforeEach(async () => {
    mockUserService = {
      findUserByEmail: (email) => {
        return Promise.resolve(users.find((usr) => usr.email === email))
      },
      create: (email: string, password: string) => {
        return Promise.resolve({
          id: 1,
          email,
          password,
        } as User)
      },
      findUserById: (id: number) =>
        Promise.resolve({ id, email: 'dfdsfsd', password: 'dfdsfsd' } as User),
      updateUserById: (id, attrs) =>
        Promise.resolve({ id, email: 'dfdsfsd', password: 'dfdsfsd' } as User),
      // deleteUserById: (id: number) => Promise.resolve({ id, email: 'dfdsfsd', password: 'dfdsfsd' } as User),,
    }

    mockAuthService = {
      signUp: (email) => {
        return Promise.resolve({} as User)
      },
      signIn: (email: string, password: string) => {
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
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUserService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile()

    controller = module.get<UsersController>(UsersController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
