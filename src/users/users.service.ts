import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prima.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PageOptions } from '@/shared/pagination/filters';
import { User } from '@prisma/client';
import { PageMetaDto } from '@/shared/pagination/pageMeta.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(payload: CreateUserDto) {
    const { password, ...data } = payload;

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prismaService.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async findAll(props: PageOptions<User>) {
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.user.findMany(props),
      this.prismaService.user.count(),
    ]);

    const meta = new PageMetaDto({ itens: data.length, total, ...props });

    return { data, meta };
  }

  async findOne(id: string) {
    const user = await this.prismaService.user.findFirst({ where: { id } });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    return user;
  }

  async findOneByUsername(username: string) {
    const user = await this.prismaService.user.findFirst({
      where: { username },
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    return this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return await this.prismaService.user.delete({ where: { id } });
  }
}
