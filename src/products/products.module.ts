import { Module, forwardRef } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from '@/prima.service';
import { BrandsModule } from '@/brands/brands.module';
import { CategoriesModule } from '@/categories/categories.module';
import { GendersModule } from '@/genders/genders.module';
import { PricesService } from '../prices/prices.service';
import { PricesModule } from '@/prices/prices.module';

@Module({
  imports: [
    BrandsModule,
    CategoriesModule,
    GendersModule,
    forwardRef(() => PricesModule),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, PricesService, PrismaService],
  exports: [ProductsService],
})
export class ProductsModule {}
