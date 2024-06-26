import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockEntity } from './stock.entity';
import { StockEntryEntity } from './stock-entries.entity';
import { ProductsModule } from '@/products/products.module';

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
