import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageOptions } from '@/shared/pagination/filters';
import { PageMetaDto } from '@/shared/pagination/pageMeta.dto';
import { BrandsService } from '@/brands/brands.service';
import { BankAccountsService } from '@/bank-accounts/bank-accounts.service';
import { ExpenseEntity } from './expenses.entity';
import { CreateExpenseDTO } from './dto/create-expense.dto';
import { UpdateExpenseDTO } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(
    private readonly brandService: BrandsService,
    private readonly accountService: BankAccountsService,
    @InjectRepository(ExpenseEntity)
    private readonly expensesRepository: Repository<ExpenseEntity>,
  ) {}

  async create(data: CreateExpenseDTO) {
    await this.brandService.findOne(data.brandId);
    await this.accountService.findOne(data.bankAccountId);

    const expense = await this.expensesRepository.save(
      this.expensesRepository.create(data),
    );

    return expense;
  }

  async findOne(id: number, raiseException = true) {
    const expense = await this.expensesRepository.findOne({ where: { id } });

    if (!expense && raiseException)
      throw new NotFoundException('Despesa não encontrada');

    return expense;
  }

  async findAll(props: PageOptions<ExpenseEntity>) {
    const [data, total] = await this.expensesRepository.findAndCount(props);

    const meta = new PageMetaDto({ itens: data.length, total, ...props });

    return { data, meta };
  }

  async update(id: number, payload: UpdateExpenseDTO) {
    await this.findOne(id);

    await this.expensesRepository.update(id, payload);

    return await this.findOne(id);
  }

  async delete(id: number) {
    const expense = await this.findOne(id);

    await this.expensesRepository.softDelete(id);

    return expense;
  }
}
