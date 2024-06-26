import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PageOptions } from '@/shared/pagination/filters';
import { PageMetaDto } from '@/shared/pagination/pageMeta.dto';
import { BrandEntity } from './brands.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(BrandEntity)
    private readonly brandRepository: Repository<BrandEntity>,
  ) {}

  async create(data: CreateBrandDto) {
    return await this.brandRepository.save(this.brandRepository.create(data));
  }

  async findAll(props: PageOptions<BrandEntity>) {
    const [data, total] = await this.brandRepository.findAndCount(props);

    const meta = new PageMetaDto({ itens: data.length, total, ...props });

    return { data, meta };
  }

  async findOne(id: number) {
    const brand = await this.brandRepository.findOne({ where: { id } });

    if (!brand) throw new NotFoundException('Marca não encontrada');

    return brand;
  }

  async update(id: number, data: UpdateBrandDto) {
    await this.findOne(id);

    await this.brandRepository.update(id, data);

    return await this.findOne(id);
  }

  async delete(id: number) {
    const brand = await this.findOne(id);

    await this.brandRepository.delete(id);

    return brand;
  }
}
