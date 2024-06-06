import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { PageOptions } from '@/shared/pagination/filters';
import { PageMetaDto } from '@/shared/pagination/pageMeta.dto';
import { PrismaService } from '@/prima.service';
import { exclude } from '@/utils/exclude';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(payload: CreateUserDto) {
    const { password, ...data } = payload;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prismaService.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    return exclude(user, ['password']);
  }

  async findAll(props: PageOptions<User>) {
    const select: Partial<Record<keyof User, boolean>> = {
      id: true,
      name: true,
      username: true,
      isAdmin: true,
      createdAt: true,
      updatedAt: true,
      lastLogin: true,
      phoneNumber: true,
    };

    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.user.findMany({ ...props, select }),
      this.prismaService.user.count(),
    ]);

    const meta = new PageMetaDto({ itens: data.length, total, ...props });

    return { data, meta };
  }

  async findOne(id: string, raiseException = true) {
    const user = await this.prismaService.user.findFirst({ where: { id } });

    if (!user && raiseException)
      throw new NotFoundException('Usuário não encontrado');

    return exclude(user, ['password']);
  }

  async findOneByUsername(username: string, withPassword = false) {
    const user = await this.prismaService.user.findFirst({
      where: { username },
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    return withPassword ? user : (exclude(user, ['password']) as User);
  }

  async update(id: string, updateUserDto: UpdateUserDto | { lastLogin: Date }) {
    await this.findOne(id);

    const user = await this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });

    return exclude(user, ['password']);
  }

  async remove(id: string) {
    await this.findOne(id);

    const user = await this.prismaService.user.delete({
      where: { id },
    });

    return exclude(user, ['password']);
  }
}
