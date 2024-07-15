import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PageOptions } from '@/shared/pagination/filters';
import { PageMetaDto } from '@/shared/pagination/pageMeta.dto';
import { CategoryEntity } from './categories.entity';
import { ProductCategoryEntity } from './products-categories.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(ProductCategoryEntity)
    private readonly categoryProductRepository: Repository<ProductCategoryEntity>,
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

  async validateExistence(ids: number[]) {
    const { data } = await this.findAll({
      where: { id: In(ids) },
    });
    const foundedIds = data.map(({ id }) => id);

    for (const id of ids) {
      if (!foundedIds.includes(id))
        throw new NotFoundException(`Categoria com id ${id} não encontrada.`);
    }

    return data;
  }

  async updateProductCategories(ids: number[], productId: number) {
    await this.validateExistence(ids);
    const categories = await this.categoryRepository.find({
      where: { products: { id: productId } },
      select: ['id'],
    });

    const dataSet = new Set<number>(categories.map(({ id }) => id));

    const toAdd = ids.reduce((acc, id) => {
      if (!dataSet.has(id)) acc.push({ productId, categoryId: id });
      return acc;
    }, []);

    const toRemove: number[] = categories.reduce((acc, category) => {
      if (!ids.includes(category.id)) acc.push(category.id);
      return acc;
    }, []);

    await this.categoryProductRepository.delete({
      productId,
      categoryId: In(toRemove),
    });
    await this.categoryProductRepository.insert(toAdd);
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
