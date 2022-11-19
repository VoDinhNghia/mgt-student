import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Res,
  HttpStatus,
} from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CreateCoutriesDto } from './dto/countries.create.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UpdateCountriesDto } from './dto/countries.update.dto';
import { CountriesService } from './countries.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { prefixUrlFlag } from '../../configs/config';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Response } from 'express';

@Controller('countries')
@ApiTags('countries')
export class CountriesController {
  constructor(private readonly service: CountriesService) {}

  @Get('list')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getAlls(@Res() res: Response) {
    try {
      const data = await this.service.findAll();
      for (const obj of data) {
        obj.flag = `${prefixUrlFlag}${obj.flag}`;
      }
      res.status(HttpStatus.OK).json({
        statusCode: 200,
        data,
        message: 'Get all countries success.',
      });
    } catch (error) {
      console.log(error);
    }
  }

  @Get('get-by-id/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async find(@Param('id') id: string, @Res() res: Response) {
    const result = await this.service.findOne(id);
    res.status(HttpStatus.OK).json({
      statusCode: 200,
      data: result,
      message: 'Get country by id success.',
    });
  }

  @Post('create')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() CreateCoutriesDto: CreateCoutriesDto,
    @Res() res: Response,
  ) {
    const result = await this.service.create(CreateCoutriesDto);
    res.status(HttpStatus.OK).json({
      statusCode: 200,
      data: result,
      message: 'Create country success.',
    });
  }

  @Put('update/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() UpdateCountriesDto: UpdateCountriesDto,
    @Res() res: Response,
  ) {
    const result = await this.service.update(id, UpdateCountriesDto);
    res.status(HttpStatus.OK).json({
      statusCode: 200,
      data: result,
      message: 'Update country success.',
    });
  }

  @Delete('delete/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string, @Res() res: Response) {
    const result = await this.service.delete(id);
    res.status(HttpStatus.OK).json({
      statusCode: 200,
      data: result,
      message: 'Delete country success.',
    });
  }
}
