import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { User } from './auth/auth.entity'
import { AuthModule } from './auth/auth.module'
import { Report } from './reports/reports.entity'
import { ReportsModule } from './reports/reports.module'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'ep-jolly-bonus-017994.eu-central-1.aws.neon.tech',
      port: 5432,
      username: 'mohamedsalem331',
      password: 'pXPj2FbeT5KO',
      database: 'neondb',
      entities: [User, Report],
      synchronize: true,
      // logging: true,
      ssl: true,
    }),
    AuthModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
