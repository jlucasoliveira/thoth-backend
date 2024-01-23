import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from '@/prima.service';
import { BrandsModule } from '@/brands/brands.module';
import { BrandsService } from '@/brands/brands.service';

@Module({
  imports: [BrandsModule],
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService, BrandsService],
})
export class ProductsModule {}
