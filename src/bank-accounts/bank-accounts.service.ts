import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '@/users/users.service';
import { PageOptions } from '@/shared/pagination/filters';
import { PageMetaDto } from '@/shared/pagination/pageMeta.dto';
import { BankAccountEntity } from './bank-accounts.entity';
import { CreateBankAccountDTO } from './dto/create-bank-account.dto';
import { UpdateBankAccountDTO } from './dto/update-bank-account.dto';

@Injectable()
export class BankAccountsService {
  constructor(
    @InjectRepository(BankAccountEntity)
    private readonly bankAccountRepository: Repository<BankAccountEntity>,
    private readonly usersService: UsersService,
  ) {}

  async create(payload: CreateBankAccountDTO) {
    if (payload.ownerId) {
      await this.usersService.findOne(payload.ownerId);
    }

    return await this.bankAccountRepository.save(
      this.bankAccountRepository.create(payload),
    );
  }

  async findAll(params: PageOptions<BankAccountEntity>) {
    const [data, total] = await this.bankAccountRepository.findAndCount(params);

    const meta = new PageMetaDto({ ...params, total, itens: data.length });

    return { data, meta };
  }

  async findOne(id: number, raiseException = true) {
    const account = await this.bankAccountRepository.findOneBy({ id });

    if (!account && raiseException)
      throw new NotFoundException(
        `Conta bancária com id=${id} não encontrada.`,
      );

    return account;
  }

  async update(id: number, payload: UpdateBankAccountDTO) {
    await this.findOne(id);

    await this.bankAccountRepository.update(id, payload);

    return await this.findOne(id);
  }

  async delete(id: number) {
    const account = await this.findOne(id);

    await this.bankAccountRepository.delete(id);

    return account;
  }
}
