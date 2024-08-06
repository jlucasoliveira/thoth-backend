import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '@/users/users.module';
import { BankAccountsController } from './bank-accounts.controller';
import { BankAccountsService } from './bank-accounts.service';
import { BankAccountEntity } from './bank-accounts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BankAccountEntity]), UsersModule],
  controllers: [BankAccountsController],
  providers: [BankAccountsService],
  exports: [BankAccountsService, TypeOrmModule],
})
export class BankAccountsModule {}
