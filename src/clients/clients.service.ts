import { Client } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prima.service';
import { exclude } from '@/utils/exclude';
import { PageOptions } from '@/shared/pagination/filters';
import { PageMetaDto } from '@/shared/pagination/pageMeta.dto';
import { CreateClientDTO } from './dto/create-client.dto';
import { UpdateClientDTO } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateClientDTO) {
    const client = await this.prismaService.client.create({ data });

    return client;
  }

  async findOne(id: string, raiseException = true) {
    const client = await this.prismaService.client.findUnique({
      where: { id },
    });

    if (!client && raiseException)
      throw new NotFoundException('Cliente não encontrado');

    return client;
  }

  async findAll(params: PageOptions<Client>) {
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.client.findMany(params),
      this.prismaService.client.count(params),
    ]);

    const meta = new PageMetaDto({ itens: data.length, total, ...params });

    const filteredClients = data.map((client) =>
      exclude(client, ['email', 'phoneNumber']),
    );

    return { data: filteredClients, meta };
  }

  async update(id: string, data: UpdateClientDTO) {
    await this.findOne(id);

    const client = await this.prismaService.client.update({
      where: { id },
      data,
    });

    return client;
  }

  async delete(id: string) {
    const client = await this.findOne(id);

    await this.prismaService.client.delete({ where: { id } });

    return client;
  }
}
