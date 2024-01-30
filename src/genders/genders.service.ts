import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prima.service';
import { CreateGenderDto } from './dto/create-gender.dto';
import { UpdateGenderDto } from './dto/update-gender.dto';
import { PageOptions } from '@/shared/pagination/filters';
import { Gender } from '@prisma/client';
import { PageMetaDto } from '@/shared/pagination/pageMeta.dto';

@Injectable()
export class GendersService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createGenderDto: CreateGenderDto) {
    return this.prismaService.gender.create({
      data: createGenderDto,
    });
  }

  async findAll(props: PageOptions<Gender>) {
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.gender.findMany(props),
      this.prismaService.gender.count(),
    ]);

    const meta = new PageMetaDto({ itens: data.length, total, ...props });

    return { data, meta };
  }

  async findOne(id: string) {
    const gender = await this.prismaService.gender.findFirst({ where: { id } });

    if (!gender) throw new NotFoundException('Gênero não encontrado');

    return gender;
  }

  async update(id: string, updateGenderDto: UpdateGenderDto) {
    await this.findOne(id);

    return this.prismaService.gender.update({
      where: { id },
      data: updateGenderDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prismaService.gender.delete({
      where: { id },
    });
  }
}
