import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { PrismaService } from '@/prima.service';
import { PricesModule } from '@/prices/prices.module';

@Module({
  imports: [PricesModule],
  controllers: [StockController],
  providers: [StockService, PrismaService],
  exports: [StockService],
})
export class StockModule {}
