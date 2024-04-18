import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { TokensController } from './tokens.controller';
import { PrismaService } from '@/prima.service';

@Module({
  providers: [PrismaService, TokensService],
  controllers: [TokensController],
  exports: [TokensService],
})
export class TokensModule {}
