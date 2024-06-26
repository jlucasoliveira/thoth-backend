import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, FindOptionsRelations, Repository } from 'typeorm';
import { PageOptions } from '@/shared/pagination/filters';
import { PageMetaDto } from '@/shared/pagination/pageMeta.dto';
import { ProductVariationEntity } from './variations.entity';
import { CreateProductVariationDTO } from './dto/create-product-variation.dto';
import { UpdateProductVariationDTO } from './dto/update-product-variation.dto';

@Injectable()
export class VariationsServices {
  constructor(
    @InjectRepository(ProductVariationEntity)
    private readonly variationRepository: Repository<ProductVariationEntity>,
  ) {}

  async create(
    productId: number,
    payloads: Array<CreateProductVariationDTO>,
    tx?: EntityManager,
  ) {
    const repository =
      tx !== undefined
        ? tx.getRepository(ProductVariationEntity)
        : this.variationRepository;

    return await repository.save(
      repository.create(payloads.map((payload) => ({ ...payload, productId }))),
    );
  }

  async findAll(
    params: PageOptions<ProductVariationEntity>,
    relations?: FindOptionsRelations<ProductVariationEntity>,
  ) {
    const [data, total] = await this.variationRepository.findAndCount({
      ...params,
      relations,
    });

    const meta = new PageMetaDto({ itens: data.length, total, ...params });

    return { data, meta };
  }

  async findOne(id: string, productId?: number) {
    const variation = await this.variationRepository.findOne({
      where: { id, productId },
    });

    if (!variation) throw new NotFoundException('Variação não encontrada');

    return variation;
  }

  async update(
    id: string,
    payload: UpdateProductVariationDTO,
    productId?: number,
  ) {
    await this.findOne(id, productId);

    await this.variationRepository.update(id, payload);

    return await this.findOne(id, productId);
  }

  async remove(id: string, productId: number) {
    const variation = await this.findOne(id, productId);

    await this.variationRepository.delete(id);

    return variation;
  }
}
