import {
  Controller,
  Get,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { StockResumeDTO } from './dto/stock-resume.dto';
import { ReportsService } from './reports.service';
import { SalesByDateRangeDTO } from './dto/sales-by-range.dto';
import { Response } from 'express';

@Controller('reports')
@UsePipes(new ValidationPipe({ transform: true }))
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('sales')
  salesResume(@Query() criteria: SalesByDateRangeDTO) {
    return this.reportsService.salesByDateRange(criteria);
  }

  @Get('stocks')
  stockResume(@Query() criteria: StockResumeDTO) {
    return this.reportsService.stockResume(criteria);
  }

  @Get('stocks-resume')
  async stockResumeReport(@Res() response: Response) {
    const report = await this.reportsService.reportStockResume();
    response.writeHead(200, {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachments; filename="test.csv"',
    });
    return response.end(report);
  }
}
