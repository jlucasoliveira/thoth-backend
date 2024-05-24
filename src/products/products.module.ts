import { Module } from '@nestjs/common';
import { PrismaService } from '@/prima.service';
import { BrandsModule } from '@/brands/brands.module';
import { CategoriesModule } from '@/categories/categories.module';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { VariationsServices } from './variations.service';
import { VariationsController } from './variations.controller';

@Module({
  imports: [BrandsModule, CategoriesModule],
  controllers: [ProductsController, VariationsController],
  providers: [ProductsService, VariationsServices, PrismaService],
  exports: [ProductsService, VariationsServices],
})
export class ProductsModule {}
