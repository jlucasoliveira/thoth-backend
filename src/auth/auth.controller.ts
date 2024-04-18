import { Request } from 'express';
import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { Public } from './guards/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  login(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.authService.login(username, password);
  }

  @Post('sign-up')
  @Public()
  signUp(@Body() payload: CreateUserDto) {
    return this.authService.createUser({ ...payload, isAdmin: false });
  }

  @Get('me')
  me(@Req() request: Request) {
    return this.authService.me(request.user?.id);
  }
}
