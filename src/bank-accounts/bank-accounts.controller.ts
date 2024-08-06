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
import { FindOptionsRelations, FindOptionsWhere } from 'typeorm';
import {
  FilterPipe,
  IncludePipe,
  SortPipe,
} from '@/shared/pagination/filters.pipe';
import { OrderBy } from '@/shared/pagination/filters';
import { BankAccountEntity } from './bank-accounts.entity';
import { BankAccountsService } from './bank-accounts.service';
import { CreateBankAccountDTO } from './dto/create-bank-account.dto';
import { UpdateBankAccountDTO } from './dto/update-bank-account.dto';

@Controller('bank-accounts')
export class BankAccountsController {
  constructor(private readonly accountsService: BankAccountsService) {}

  @Post()
  create(@Body() payload: CreateBankAccountDTO) {
    return this.accountsService.create(payload);
  }

  @Get()
  findAll(
    @Query('filter', FilterPipe) where: FindOptionsWhere<BankAccountEntity>,
    @Query('sort', SortPipe) order: OrderBy<BankAccountEntity>,
    @Query('skip', new ParseIntPipe({ optional: true })) skip: number = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take: number = 10,
    @Query('include', IncludePipe)
    relations?: FindOptionsRelations<BankAccountEntity>,
  ) {
    return this.accountsService.findAll({
      where,
      order,
      relations,
      skip,
      take,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.accountsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateBankAccountDTO,
  ) {
    return this.accountsService.update(id, payload);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.accountsService.delete(id);
  }
}
