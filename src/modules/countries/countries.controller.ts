import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { UpdateCountriesDto } from './dto/countries.update.dto';
import { CountriesService } from './countries.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { prefixUrlFlag } from '../../configs/config';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Response } from 'express';
import { join } from 'path';
import { readFileSync } from 'fs';

@Controller('countries')
@ApiTags('countries')
export class CountriesController {
  constructor(private readonly countryService: CountriesService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getAlls(@Res() res: Response) {
    const data = await this.countryService.findAllCountry();
    for (const obj of data) {
      obj.flag = `${prefixUrlFlag}${obj.flag}`;
    }
    res.status(HttpStatus.OK).json({
      statusCode: 200,
      data,
      message: 'Get all countries success.',
    });
  }

  @Get('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async find(@Param('id') id: string, @Res() res: Response) {
    const result = await this.countryService.findOneCountry(id);
    res.status(HttpStatus.OK).json({
      statusCode: 200,
      data: result,
      message: 'Get country by id success.',
    });
  }

  @Post('/init-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async initCountries(@Res() res: Response) {
    const data = JSON.parse(
      readFileSync(
        join(
          __dirname,
          '../../../..',
          'src/files/import-countries/countries.json',
        ),
        'utf-8',
      ),
    );
    const result = await this.countryService.initCountries(data);
    res.status(HttpStatus.OK).json({
      statusCode: 200,
      data: result,
      message: 'Init countries success.',
    });
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateCountriesDto: UpdateCountriesDto,
    @Res() res: Response,
  ) {
    const result = await this.countryService.updateCountry(
      id,
      updateCountriesDto,
    );
    res.status(HttpStatus.OK).json({
      statusCode: 200,
      data: result,
      message: 'Update country success.',
    });
  }

  @Post('/province/init-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async initProvince(@Res() res: Response) {
    const data = JSON.parse(
      readFileSync(
        join(
          __dirname,
          '../../../..',
          'src/files/import-countries/province.json',
        ),
        'utf-8',
      ),
    );
    const result = await this.countryService.initProvinces(data);
    res.status(HttpStatus.OK).json({
      statusCode: 200,
      data: result,
      message: 'Init province success.',
    });
  }

  @Post('/district/init-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async initDistrict(@Res() res: Response) {
    res.status(HttpStatus.OK).json({
      statusCode: 200,
      data: 0,
      message: 'Init district success.',
    });
  }

  @Post('/ward/init-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async initWard(@Res() res: Response) {
    res.status(HttpStatus.OK).json({
      statusCode: 200,
      data: 0,
      message: 'Init ward success.',
    });
  }
}
