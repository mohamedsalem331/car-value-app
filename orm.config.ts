import { TypeOrmModuleOptions } from '@nestjs/typeorm'

const { DataSource } = require('typeorm')
const { ConfigService } = require('@nestjs/config')
const { config } = require('dotenv')

config({ path: __dirname + '/.env.development', debug: true })
const configService = new ConfigService()
console.log(process.env.DB_DATABASE)

export const typeOrmConfig: TypeOrmModuleOptions = new DataSource({
  ssl: true,
  type: 'postgres',
  host: configService.getOrThrow('DB_HOST'),
  port: configService.getOrThrow('DB_PORT'),
  username: configService.getOrThrow('DB_USERNAME'),
  password: configService.getOrThrow('DB_PASSWORD'),
  database: configService.getOrThrow('DB_DATABASE'),
  entities: ['src/**/*.entity.js'],
  migrations: ['src/migrations/*.js'],
  // migrationsRun: true,
  cli: {
    migrationsDir: __dirname + '/migrations',
  },
  synchronize: false,
})
