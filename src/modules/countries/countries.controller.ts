import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Res,
  Query,
} from '@nestjs/common';
import { UpdateCountriesDto } from './dto/countries.update.dto';
import { CountriesService } from './countries.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { prefixUrlFlag } from '../../configs/config';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Response } from 'express';
import { join } from 'path';
import { readFileSync } from 'fs';
import { QueryPovinceDto } from './dto/countries.query-province.dto';
import { QueryDistrictDto } from './dto/countries.query-district.dto';
import { ResponseRequest } from 'src/abstracts/responseApi';
import { RoleGuard } from '../auth/role-auth.guard';
import { roleTypeAccessApi } from 'src/commons/constants';

@Controller('api/countries')
@ApiTags('countries')
export class CountriesController {
  constructor(private readonly countryService: CountriesService) {}

  @Get()
  async getAlls(@Res() res: Response): Promise<ResponseRequest> {
    const data = await this.countryService.findAllCountry();
    for (const obj of data) {
      obj.flag = `${prefixUrlFlag}${obj.flag}`;
    }
    return new ResponseRequest(res, data, `Get all countries success.`);
  }

  @Get('/provinces')
  async getPovinceAlls(
    @Query() queryPovinceDto: QueryPovinceDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.countryService.findAllProvinces(queryPovinceDto);
    return new ResponseRequest(res, result, `Get all provinces success.`);
  }

  @Get('/districts')
  async getDistrictAlls(
    @Query() queryDistrictDto: QueryDistrictDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.countryService.findAllDistricts(queryDistrictDto);
    return new ResponseRequest(res, result, `Get all district success.`);
  }

  @Get('/wards')
  async getWardAlls(@Res() res: Response): Promise<ResponseRequest> {
    const result = await this.countryService.findAllWards();
    return new ResponseRequest(res, result, `Get all wards success.`);
  }

  @Get('/:id')
  async find(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.countryService.findOneCountry(id);
    return new ResponseRequest(res, result, `Get country by id success.`);
  }

  @Post('/init-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async initCountries(@Res() res: Response): Promise<ResponseRequest> {
    const data = this.readFileJson('countries.json');
    const result = await this.countryService.initCountries(data);
    return new ResponseRequest(res, result, `Init countries success.`);
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async update(
    @Param('id') id: string,
    @Body() updateCountriesDto: UpdateCountriesDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.countryService.updateCountry(
      id,
      updateCountriesDto,
    );
    return new ResponseRequest(res, result, `Update country success.`);
  }

  @Post('/province/init-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async initProvince(@Res() res: Response): Promise<ResponseRequest> {
    const data = this.readFileJson('province.json');
    const result = await this.countryService.initProvinces(data);
    return new ResponseRequest(res, result, `Init province success.`);
  }

  @Post('/district/init-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async initDistrict(@Res() res: Response): Promise<ResponseRequest> {
    const data = this.readFileJson('district.json');
    const result = await this.countryService.initDisTricts(data);
    return new ResponseRequest(res, result, 'Init district success');
  }

  @Post('/ward/init-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async initWard(@Res() res: Response): Promise<ResponseRequest> {
    const data = this.readFileJson('ward.json');
    const result = await this.countryService.initWards(data);
    return new ResponseRequest(res, result, 'Init ward success');
  }

  readFileJson(fileName: string) {
    return JSON.parse(
      readFileSync(
        join(
          __dirname,
          '../../../..',
          `src/files/import-countries/${fileName}`,
        ),
        'utf-8',
      ),
    );
  }
}
