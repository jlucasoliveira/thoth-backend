import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/users/users.service';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { ChangePasswordDTO } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOneByUsername(username, true);

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

    await this.usersService.update(
      user.id,
      { lastLogin: new Date() },
      { refresh: false, validateExists: false },
    );

    return { accessToken };
  }

  createUser(payload: CreateUserDto) {
    return this.usersService.create(payload);
  }

  me(userId: string) {
    return this.usersService.findOne(userId);
  }

  async changePassword(payload: ChangePasswordDTO) {
    if (payload.newPassword !== payload.confirmPassword)
      throw new BadRequestException('As senhas não coincidem!');

    const password = await bcrypt.hash(payload.newPassword, 10);

    await this.usersService.update(
      payload.userId,
      { password },
      { refresh: false },
    );
  }
}
