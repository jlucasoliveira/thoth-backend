import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandsModule } from '@/brands/brands.module';
import { CategoriesModule } from '@/categories/categories.module';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductEntity } from './products.entity';
import { VariationsServices } from './variations.service';
import { VariationsController } from './variations.controller';
import { ProductVariationEntity } from './variations.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, ProductVariationEntity]),
    BrandsModule,
    CategoriesModule,
  ],
  controllers: [ProductsController, VariationsController],
  providers: [ProductsService, VariationsServices],
  exports: [ProductsService, VariationsServices],
})
export class ProductsModule {}
