import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/users/users.service';
import { CreateUserDto } from '@/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOneByUsername(username);

    const hasValidPassword = await bcrypt.compare(password, user.password);

    if (!hasValidPassword)
      throw new UnauthorizedException('Usuário ou senha incorreta');

    return user;
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);

    const accessToken = await this.jwtService.signAsync({
      username,
      sub: user.id,
    });

    return { accessToken };
  }

  createUser(payload: CreateUserDto) {
    return this.usersService.create(payload);
  }

  me(userId: string) {
    return this.usersService.findOne(userId);
  }
}
