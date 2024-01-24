import { Module, forwardRef } from '@nestjs/common';
import { PrismaService } from '@/prima.service';
import { ProductsModule } from '@/products/products.module';
import { PricesService } from './prices.service';
import { PricesController } from './prices.controller';

@Module({
  imports: [forwardRef(() => ProductsModule)],
  providers: [PricesService, PrismaService],
  exports: [PricesService],
  controllers: [PricesController],
})
export class PricesModule {}
