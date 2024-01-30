import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { Gender } from '@prisma/client';
import { OrderBy } from '@/shared/pagination/filters';
import { Filter } from '@/shared/pagination/pageOptions.dto';
import { FilterPipe, SortPipe } from '@/shared/pagination/filters.pipe';
import { GendersService } from './genders.service';
import { CreateGenderDto } from './dto/create-gender.dto';
import { UpdateGenderDto } from './dto/update-gender.dto';

@Controller('genders')
export class GendersController {
  constructor(private readonly gendersService: GendersService) {}

  @Post()
  create(@Body() createGenderDto: CreateGenderDto) {
    return this.gendersService.create(createGenderDto);
  }

  @Get()
  findAll(
    @Query('filters', FilterPipe) where: Filter<Gender>,
    @Query('sort', SortPipe) orderBy: OrderBy<Gender>,
    @Query('skip', ParseIntPipe) skip: number = 0,
    @Query('take', ParseIntPipe) take: number = 10,
  ) {
    return this.gendersService.findAll({ where, orderBy, skip, take });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gendersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGenderDto: UpdateGenderDto) {
    return this.gendersService.update(id, updateGenderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gendersService.remove(id);
  }
}
