import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from '@/prima.service';
import { BrandsModule } from '@/brands/brands.module';
import { BrandsService } from '@/brands/brands.service';
import { CategoriesModule } from '@/categories/categories.module';
import { CategoriesService } from '@/categories/categories.service';
import { GendersModule } from '@/genders/genders.module';
import { GendersService } from '@/genders/genders.service';

@Module({
  imports: [BrandsModule, CategoriesModule, GendersModule],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    PrismaService,
    BrandsService,
    CategoriesService,
    GendersService,
  ],
})
export class ProductsModule {}
