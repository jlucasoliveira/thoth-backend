import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Prices } from '@prisma/client';
import { PrismaService } from '@/prima.service';
import { CreatePriceDto } from './dto/create-price.dto';
import { ProductsService } from '../products/products.service';
import { PageOptions } from '@/shared/pagination/filters';
import { PageMetaDto } from '@/shared/pagination/pageMeta.dto';

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

  async findAll(productId: string, props: PageOptions<Prices>) {
    props.where.productId = productId;
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.prices.findMany(props),
      this.prismaService.prices.count(),
    ]);

    const meta = new PageMetaDto({ itens: data.length, total, ...props });

    return { data, meta };
  }
}
