import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { TokensService } from './tokens.service';
import { CreateTokenDTO } from './dto/create-token.dto';
import { Request } from 'express';

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Post()
  create(@Req() request: Request, @Body() payload: CreateTokenDTO) {
    return this.tokensService.create(payload, request.user);
  }

  @Get()
  findAll(@Req() request: Request) {
    return this.tokensService.findAll(request.user);
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.tokensService.findOne(id);
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.tokensService.findOne(id);
  }
}
