import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaService } from '@/prima.service';
import { ClientsService } from '@/clients/clients.service';

@Module({
  providers: [OrdersService, ClientsService, PrismaService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
