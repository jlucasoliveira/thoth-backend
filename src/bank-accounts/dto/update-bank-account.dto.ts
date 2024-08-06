import { PartialType } from '@nestjs/mapped-types';
import { CreateBankAccountDTO } from './create-bank-account.dto';

export class UpdateBankAccountDTO extends PartialType(CreateBankAccountDTO) {}
