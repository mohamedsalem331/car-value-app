import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Req,
  Res,
  Query,
  Logger,
} from '@nestjs/common'
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator'
import { AuthGuard } from '@nestjs/passport'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { AdminGuard } from 'src/common/guards/admin.guard'
import { Serialize } from 'src/common/interceptors/serialize.interceptor'
import { User } from 'src/users/entities/users.entity'
import { ReportEstimateDto } from './dto'
import { CreateReportDto } from './dto/report-create.dto'
import { ReportDto } from './dto/report.dto'
import { Report } from './entities/reports.entity'
import { ReportsService } from './reports.service'

@Controller('reports')
@UseGuards(AuthGuard('jwt'))
export class ReportsController {
  private readonly logger = new Logger(ReportsController.name)

  constructor(private reportsService: ReportsService) {}

  @Post()
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    this.logger.verbose('New Report Created ' + JSON.stringify(body))
    return this.reportsService.create(body, user)
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  updateReport(
    @Param('id') id: string,
    @Body() body: { approved: boolean },
  ): Promise<Report> {
    this.logger.verbose('Report Updated ' + id)

    return this.reportsService.updateOneById(id, body)
  }

  @Get()
  getReports(@Query() query: ReportEstimateDto): Promise<{ price: number }> {
    this.logger.log('New Estimate Report')
    return this.reportsService.getEstimate(query)
  }
}
