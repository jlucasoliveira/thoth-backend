import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ProductsModule } from '@/products/products.module';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { StockEntity } from './stock.entity';
import { StockEntryEntity } from './stock-entries.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockEntity, StockEntryEntity]),
    ProductsModule,
  ],
  controllers: [StockController],
  providers: [StockService],
  exports: [StockService],
})
export class StockModule {}
