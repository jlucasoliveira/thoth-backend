import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockModule } from '@/stock/stock.module';
import { ClientsModule } from '@/clients/clients.module';
import { ProductVariationEntity } from '@/products/variations.entity';
import { OrderItemEntity } from './order-items.entity';
import { OrderEntity } from './orders.entity';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      OrderItemEntity,
      ProductVariationEntity,
    ]),
    ClientsModule,
    StockModule,
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
