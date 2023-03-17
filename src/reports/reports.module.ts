import { Module } from '@nestjs/common'
import { ReportsService } from './reports.service'
import { ReportsController } from './reports.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Report } from './entities/reports.entity'
import { Logger } from '@nestjs/common/services/logger.service'

@Module({
  imports: [TypeOrmModule.forFeature([Report])],
  providers: [ReportsService, Logger],
  controllers: [ReportsController],
})
export class ReportsModule {}
