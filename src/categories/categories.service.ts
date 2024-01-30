import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '@/prima.service';
import { PageOptions } from '@/shared/pagination/filters';
import { Category } from '@prisma/client';
import { PageMetaDto } from '@/shared/pagination/pageMeta.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.prismaService.category.create({
      data: createCategoryDto,
    });
  }

  async findAll(props: PageOptions<Category>) {
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.category.findMany(props),
      this.prismaService.category.count(),
    ]);

    const meta = new PageMetaDto({ itens: data.length, total, ...props });

    return { data, meta };
  }

  async findOne(id: string) {
    const category = await this.prismaService.category.findFirst({
      where: { id },
    });

    if (!category) throw new NotFoundException('Categoria não encontrada');

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);

    return this.prismaService.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prismaService.category.delete({ where: { id } });
  }
}
