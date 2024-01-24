import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '@/prima.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.prismaService.category.create({
      data: createCategoryDto,
    });
  }

  findAll() {
    return this.prismaService.category.findMany();
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
