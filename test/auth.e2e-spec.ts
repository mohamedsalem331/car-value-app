import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { APP_PIPE, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import * as request from 'supertest'
import { AuthService } from '../src/users/auth.service'
import { UsersModule } from '../src/users/users.module'
import { UsersService } from '../src/users/users.service'
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor'
import cookieParser from 'cookie-parser'

describe('Auth (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
      providers: [
        UsersService,
        AuthService,
        {
          provide: APP_PIPE,
          useValue: new ValidationPipe({
            whitelist: true,
          }),
        },
        {
          provide: APP_INTERCEPTOR,
          useExisting: new TransformInterceptor(),
        },
      ],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.use(app.use(cookieParser()))
    await app.init()
  })

  it('handles /POST signup request ', () => {
    const mockBody = { email: 'toto@gmail.com', password: 'gffd' }

    // superset doesnt handle cookie automatic like api tool

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(mockBody)
      .expect(201)
      .then((response) => {
        const { id, email } = response.body
        expect(id).toBeDefined()
        expect(email).toEqual(mockBody.email)
      })
  })

  afterAll(async () => {
    await app.close()
  })
})
