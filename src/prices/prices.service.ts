import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { PrismaService } from '@/prima.service';
import { CreatePriceDto } from './dto/create-price.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class PricesService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService,
  ) {}

  async create(
    productId: string,
    payload: CreatePriceDto,
    updateProduct = true,
  ) {
    const product = await this.productsService.findOne(productId);

    const price = await this.prismaService.prices.create({
      data: { ...payload, productId },
    });

    if (updateProduct)
      await this.productsService.update(product.id, { price: payload.price });

    return price;
  }

  findAll(productId: string) {
    return this.prismaService.prices.findMany({ where: { productId } });
  }
}
