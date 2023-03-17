import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'
import * as cookieParser from 'cookie-parser'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  const logger = new Logger()
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  app.use(cookieParser(configService.get('COOKIE_KEY')))
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )
  app.useGlobalInterceptors(new TransformInterceptor())
  const PORT = process.env.PORT || 3000
  await app.listen(PORT, () =>
    logger.log(`Application Running on PORT ${PORT}`),
  )
}
bootstrap()
