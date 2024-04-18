import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prima.service';
import { CreateTokenDTO } from './dto/create-token.dto';

@Injectable()
export class TokensService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(payload: CreateTokenDTO, user: Express.User) {
    const data = { ...payload, userId: user.id };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { token: _, ...where } = data;

    const token = await this.prismaService.token.findFirst({ where });

    if (!token) {
      const newToken = await this.prismaService.token.create({ data });
      return newToken;
    }

    return await this.prismaService.token.update({
      where: { id: token.id },
      data: { token: payload.token },
    });
  }

  async findAll(user: Express.User) {
    const tokens = await this.prismaService.token.findMany({
      where: { userId: user.id },
    });
    return tokens;
  }

  async findOne(id: string) {
    const token = await this.prismaService.token.findFirst({
      where: { id },
    });

    if (!token) throw new NotFoundException('Token não encontrado');

    return token;
  }

  async delete(id: string) {
    await this.findOne(id);
    await this.prismaService.token.delete({ where: { id } });
  }
}
