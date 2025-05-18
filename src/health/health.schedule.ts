import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HealthService } from './health.service';

@Injectable()
export class HealthSchedule {
  private readonly logger = new Logger(HealthSchedule.name);

  constructor(private readonly healthService: HealthService) {}

  @Cron('59 59 23 * * *', {
    name: 'DATABASE_HEALTH_CHECK',
    timeZone: 'America/Fortaleza',
  })
  async keepDatabaseActive() {
    const result = await this.healthService.check();
    if (result.status === 'error') this.logger.error(result);
    else this.logger.log(result);
  }
}
