import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prima.service';
import { CreateGenderDto } from './dto/create-gender.dto';
import { UpdateGenderDto } from './dto/update-gender.dto';

@Injectable()
export class GendersService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createGenderDto: CreateGenderDto) {
    return this.prismaService.gender.create({
      data: createGenderDto,
    });
  }

  findAll() {
    return this.prismaService.gender.findMany();
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
