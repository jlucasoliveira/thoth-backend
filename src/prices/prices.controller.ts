import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreatePriceDto } from './dto/create-price.dto';
import { PricesService } from './prices.service';

@Controller('products/:productId/prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Post()
  create(
    @Param('productId') productId: string,
    @Body() payload: CreatePriceDto,
  ) {
    return this.pricesService.create(productId, payload);
  }

  @Get()
  findAll(@Param('productId') productId: string) {
    return this.pricesService.findAll(productId);
  }
}
