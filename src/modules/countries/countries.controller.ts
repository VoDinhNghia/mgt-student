import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateCoutriesDto } from './dto/countries.create.dto';
import { UpdateCountriesDto } from './dto/countries.update.dto';
import { CountriesService } from './countries.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { prefixUrlFlag } from '../../configs/config';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('countries')
@ApiTags('countries')
export class CountriesController {
  constructor(private readonly service: CountriesService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async index() {
    try {
      const data = await this.service.findAll();
      for (const obj of data) {
        obj.flag = `${prefixUrlFlag}${obj.flag}`;
      }
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async find(@Param('id') id: string) {
    return await this.service.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async create(@Body() CreateCoutriesDto: CreateCoutriesDto) {
    return await this.service.create(CreateCoutriesDto);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() UpdateCountriesDto: UpdateCountriesDto,
  ) {
    return await this.service.update(id, UpdateCountriesDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    return await this.service.delete(id);
  }
}
