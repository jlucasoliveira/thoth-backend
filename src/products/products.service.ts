import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BrandsService } from '@/brands/brands.service';
import { CategoriesService } from '@/categories/categories.service';
import { ProductCategoryEntity } from '../categories/products-categories.entity';
import { PageOptions } from '@/shared/pagination/filters';
import { PageMetaDto } from '@/shared/pagination/pageMeta.dto';
import { ProductEntity } from './products.entity';
import { VariationsServices } from './variations.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly brandsService: BrandsService,
    private readonly categoriesService: CategoriesService,
    private readonly variationsService: VariationsServices,
  ) {}

  async create(user: Express.User, createProductDto: CreateProductDto) {
    const { variations, categories, ...data } = createProductDto;
    await this.brandsService.findOne(data.brandId);
    await this.categoriesService.validateExistence(categories);

    return await this.productRepository.manager.transaction(async (tx) => {
      const repository = tx.getRepository(ProductEntity);
      const product = await repository.save(repository.create(data));
      await tx
        .getRepository(ProductCategoryEntity)
        .insert(
          categories.map((id) => ({ categoryId: id, productId: product.id })),
        );

      if (variations?.length)
        await this.variationsService.create(user, product.id, variations, tx);

      return product;
    });
  }

  async findAll(props: PageOptions<ProductEntity>) {
    const [data, total] = await this.productRepository.findAndCount(props);

    const meta = new PageMetaDto({ itens: data.length, total, ...props });

    return { data, meta };
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) throw new NotFoundException('Produto não encontrado');

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);
    const { categories, ...payload } = updateProductDto;

    if (
      updateProductDto.brandId &&
      product.brandId !== updateProductDto.brandId
    ) {
      await this.brandsService.findOne(updateProductDto.brandId);
    }

    if (categories && categories.length > 0) {
      await this.categoriesService.updateProductCategories(
        categories,
        product.id,
      );
    }

    await this.productRepository.update(id, payload);

    return await this.findOne(id);
  }

  async remove(id: number) {
    const product = await this.findOne(id);

    await this.productRepository.delete(id);

    return product;
  }
}
