import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prima.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
  constructor(private readonly prismaService: PrismaService) {}

  create(data: CreateBrandDto) {
    return this.prismaService.brand.create({ data });
  }

  findAll() {
    return this.prismaService.brand.findMany();
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
