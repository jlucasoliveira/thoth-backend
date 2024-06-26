import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JWT_CONFIG } from '@/config/configuration';
import { UsersModule } from '@/users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: JWT_CONFIG.secret,
      signOptions: { expiresIn: JWT_CONFIG.expireIn },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
