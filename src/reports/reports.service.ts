import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/users/entities/users.entity'
import { Repository } from 'typeorm'
import { CreateReportDto } from './dto/report-create.dto'
import { ReportEstimateDto } from './dto/report-estimate.dto'
import { Report } from './entities/reports.entity'

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
  ) {}

  async create(reportDto: CreateReportDto, user: User): Promise<Report> {
    const report = this.reportsRepository.create(reportDto)
    report.user = user

    return this.reportsRepository.save(report)
  }

  async updateOneById(
    id: string,
    reportDto: { approved: boolean },
  ): Promise<Report> {
    const report = await this.reportsRepository.findOne({
      where: { id: parseInt(id) },
    })

    Object.assign(report, reportDto)

    return this.reportsRepository.save(report)
  }

  getEstimate({ make, model, lng, lat, year, mileage }: ReportEstimateDto) {
    const query = this.reportsRepository.createQueryBuilder()

    return query
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawOne()
  }
}
