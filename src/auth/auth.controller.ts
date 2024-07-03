import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { Public } from './guards/public.decorator';
import { User } from './guards/user.decorator';
import { ChangePasswordDTO } from './dto/change-password.dto';

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
  me(@User() user: Express.User) {
    return this.authService.me(user?.id);
  }

  @Post('change-password')
  @HttpCode(204)
  changePassword(@Body() payload: ChangePasswordDTO) {
    return this.authService.changePassword(payload);
  }
}
