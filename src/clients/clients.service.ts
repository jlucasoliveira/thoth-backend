import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PageOptions } from '@/shared/pagination/filters';
import { PageMetaDto } from '@/shared/pagination/pageMeta.dto';
import { ClientEntity } from './clients.entity';
import { CreateClientDTO } from './dto/create-client.dto';
import { UpdateClientDTO } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
  ) {}

  async create(data: CreateClientDTO) {
    const client = await this.clientRepository.save(
      this.clientRepository.create(data),
    );

    return client;
  }

  async findOne(id: string, raiseException = true) {
    const client = await this.clientRepository.findOne({
      where: { id },
    });

    if (!client && raiseException)
      throw new NotFoundException('Cliente não encontrado');

    return client;
  }

  async findOneOrDefault(id?: string) {
    if (id) return await this.findOne(id);

    const defaultName = 'Comprador Avulso';
    const defaultClient = await this.clientRepository.findOne({
      where: { name: defaultName },
    });

    return defaultClient;
  }

  async findAll(params: PageOptions<ClientEntity>) {
    const [data, total] = await this.clientRepository.findAndCount({
      ...params,
      select: { id: true, name: true, createdAt: true, updatedAt: true },
    });

    const meta = new PageMetaDto({ itens: data.length, total, ...params });

    return { data, meta };
  }

  async update(id: string, data: UpdateClientDTO) {
    await this.findOne(id);

    await this.clientRepository.update(id, data);

    return await this.findOne(id);
  }

  async delete(id: string) {
    const client = await this.findOne(id);

    await this.clientRepository.delete(id);

    return client;
  }
}
