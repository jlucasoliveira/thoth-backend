import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prima.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from '@prisma/client';
import { PageOptions } from '@/shared/pagination/filters';
import { PageMetaDto } from '@/shared/pagination/pageMeta.dto';

@Injectable()
export class BrandsService {
  constructor(private readonly prismaService: PrismaService) {}

  create(data: CreateBrandDto) {
    return this.prismaService.brand.create({ data });
  }

  async findAll(props: PageOptions<Brand>) {
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.brand.findMany(props),
      this.prismaService.brand.count(),
    ]);

    const meta = new PageMetaDto({ itens: data.length, total, ...props });

    return { data, meta };
  }

  async findOne(id: string) {
    const brand = await this.prismaService.brand.findFirst({ where: { id } });

    if (!brand) throw new NotFoundException('Marca não encontrada');

    return brand;
  }

  async update(id: string, data: UpdateBrandDto) {
    await this.findOne(id);

    return this.prismaService.brand.update({ where: { id }, data });
  }

  async delete(id: string) {
    const brand = await this.findOne(id);
    await this.prismaService.brand.delete({ where: { id } });

    return brand;
  }
}
