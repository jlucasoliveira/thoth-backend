import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PageOptions } from '@/shared/pagination/filters';
import { PageMetaDto } from '@/shared/pagination/pageMeta.dto';
import { CategoryEntity } from './categories.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return await this.categoryRepository.save(
      this.categoryRepository.create(createCategoryDto),
    );
  }

  async findAll(props: PageOptions<CategoryEntity>) {
    const [data, total] = await this.categoryRepository.findAndCount(props);

    const meta = new PageMetaDto({ itens: data.length, total, ...props });

    return { data, meta };
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) throw new NotFoundException('Categoria não encontrada');

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);

    await this.categoryRepository.update(id, updateCategoryDto);

    return await this.findOne(id);
  }

  async remove(id: number) {
    const category = await this.findOne(id);

    await this.categoryRepository.delete(id);

    return category;
  }
}
