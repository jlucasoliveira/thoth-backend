import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandsModule } from '@/brands/brands.module';
import { BankAccountsModule } from '@/bank-accounts/bank-accounts.module';
import { ExpenseEntity } from './expenses.entity';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExpenseEntity]),
    BrandsModule,
    BankAccountsModule,
  ],
  providers: [ExpensesService],
  exports: [ExpensesService, TypeOrmModule],
  controllers: [ExpensesController],
})
export class ExpensesModule {}
