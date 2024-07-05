import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { User } from '@/auth/guards/user.decorator';
import { Filter } from '@/shared/pagination/pageOptions.dto';
import { OrderBy } from '@/shared/pagination/filters';
import { FilterPipe, SortPipe } from '@/shared/pagination/filters.pipe';
import { PaymentEntity } from './payments.entity';
import { PaymentsService } from './payments.service';
import { CreatePaymentDTO } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@User() user: Express.User, @Body() payload: CreatePaymentDTO) {
    return this.paymentsService.create(user, payload);
  }

  @Get()
  findAll(
    @Query('filter', FilterPipe) where: Filter<PaymentEntity>,
    @Query('sort', SortPipe) order: OrderBy<PaymentEntity>,
    @Query('skip', new ParseIntPipe({ optional: true })) skip: number = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take: number = 10,
  ) {
    return this.paymentsService.findAll({ order, skip, take, where });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.findOne(id);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.delete(id);
  }
}
