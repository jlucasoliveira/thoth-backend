import { FindOptionsRelations, FindOptionsWhere } from 'typeorm';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  FilterPipe,
  IncludePipe,
  SortPipe,
} from '@/shared/pagination/filters.pipe';
import { OrderBy } from '@/shared/pagination/filters';
import { ExpensesService } from './expenses.service';
import { ExpenseEntity } from './expenses.entity';
import { CreateExpenseDTO } from './dto/create-expense.dto';
import { UpdateExpenseDTO } from './dto/update-expense.dto';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  findAll(
    @Query('filter', FilterPipe) where: FindOptionsWhere<ExpenseEntity>,
    @Query('sort', SortPipe) order: OrderBy<ExpenseEntity>,
    @Query('skip', new ParseIntPipe({ optional: true })) skip: number = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take: number = 0,
    @Query('include', IncludePipe)
    relations?: FindOptionsRelations<ExpenseEntity>,
  ) {
    return this.expensesService.findAll({
      where,
      order,
      relations,
      skip,
      take,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.expensesService.findOne(id);
  }

  @Post()
  create(@Body() payload: CreateExpenseDTO) {
    return this.expensesService.create(payload);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateExpenseDTO,
  ) {
    return this.expensesService.update(id, payload);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.expensesService.delete(id);
  }
}
