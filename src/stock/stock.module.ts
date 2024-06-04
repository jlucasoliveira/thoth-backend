import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { PrismaService } from '@/prima.service';
import { VariationsServices } from '@/products/variations.service';

@Module({
  controllers: [StockController],
  providers: [StockService, VariationsServices, PrismaService],
  exports: [StockService],
})
export class StockModule {}
