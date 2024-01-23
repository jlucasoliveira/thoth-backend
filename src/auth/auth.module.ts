import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '@/users/users.module';
import { UsersService } from '@/users/users.service';
import { PrismaService } from '@/prima.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConfig } from './constants';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: { expiresIn: jwtConfig.expires },
    }),
  ],
  providers: [UsersService, AuthService, JwtStrategy, PrismaService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
