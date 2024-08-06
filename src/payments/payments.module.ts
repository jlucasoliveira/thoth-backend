import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccountsModule } from '@/bank-accounts/bank-accounts.module';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PaymentEntity } from './payments.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity]), BankAccountsModule],
  providers: [PaymentsService],
  controllers: [PaymentsController],
  exports: [PaymentsService, TypeOrmModule],
})
export class PaymentsModule {}
