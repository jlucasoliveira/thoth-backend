import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PageOptions } from '@/shared/pagination/filters';
import { PageMetaDto } from '@/shared/pagination/pageMeta.dto';
import { exclude } from '@/utils/exclude';
import { UserEntity } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

type UserUpdatePayload =
  | UpdateUserDto
  | { lastLogin: Date }
  | { password: string };

type UserUpdateOptions = {
  /** Refetch user after execute the update */
  refresh?: boolean;
  /** Checks if user exists before execute the update */
  validateExists?: boolean;
};

const updateOptions: UserUpdateOptions = {
  refresh: true,
  validateExists: true,
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(payload: CreateUserDto) {
    const { password, ...data } = payload;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.save(
      this.userRepository.create({
        ...data,
        password: hashedPassword,
      }),
    );

    return exclude(user, ['password']);
  }

  async findAll(props: PageOptions<UserEntity>) {
    const select: Partial<Record<keyof UserEntity, boolean>> = {
      id: true,
      name: true,
      username: true,
      isAdmin: true,
      createdAt: true,
      updatedAt: true,
      lastLogin: true,
      phoneNumber: true,
    };

    const [data, total] = await this.userRepository.findAndCount({
      ...props,
      select,
    });

    const meta = new PageMetaDto({ itens: data.length, total, ...props });

    return { data, meta };
  }

  async findOne(id: string, raiseException = true) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user && raiseException)
      throw new NotFoundException('Usuário não encontrado');

    return exclude(user, ['password']);
  }

  async findOneByUsername(username: string, withPassword = false) {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    return withPassword ? user : (exclude(user, ['password']) as UserEntity);
  }

  async update(
    id: string,
    updateUserDto: UserUpdatePayload,
    options: UserUpdateOptions = updateOptions,
  ) {
    if (options.validateExists !== false) await this.findOne(id);

    await this.userRepository.update(id, updateUserDto);

    if (options.refresh !== false) return await this.findOne(id);
  }

  async remove(id: string) {
    const user = await this.findOne(id);

    await this.userRepository.delete(id);

    return user;
  }
}
