import { Module } from '@nestjs/common';
import { PrismaService } from '@/prima.service';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';

@Module({
  providers: [BrandsService, PrismaService],
  controllers: [BrandsController],
  exports: [BrandsService],
})
export class BrandsModule {}
