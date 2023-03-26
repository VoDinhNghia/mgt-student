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
import { JwtAuthGuard } from '../auth/guards/auth.jwt-auth.guard';
import { Response } from 'express';
import { QueryPovinceDto } from './dto/countries.query-province.dto';
import { QueryDistrictDto } from './dto/countries.query-district.dto';
import { ResponseRequest } from 'src/utils/utils.response-api';
import { RoleGuard } from '../auth/guards/auth.role-auth.guard';
import { ErolesUser } from 'src/constants/constant';
import { ConfigService } from '@nestjs/config';
import { msgResponse } from 'src/constants/constants.message.response';
import { readFileJson } from 'src/utils/utils.file.read-json';

@Controller('api/countries')
@ApiTags('countries')
export class CountriesController {
  constructor(
    private readonly countryService: CountriesService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async getAlls(@Res() res: Response): Promise<ResponseRequest> {
    const data = await this.countryService.findAllCountry();
    for (const obj of data) {
      obj.flag = `${this.configService.get('PREFIX_URL_FLAG')}${obj.flag}`;
    }
    return new ResponseRequest(res, data, msgResponse.getAllCountries);
  }

  @Get('/provinces')
  async getPovinceAlls(
    @Query() queryPovinceDto: QueryPovinceDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.countryService.findAllProvinces(queryPovinceDto);
    return new ResponseRequest(res, result, msgResponse.getAllProvince);
  }

  @Get('/districts')
  async getDistrictAlls(
    @Query() queryDistrictDto: QueryDistrictDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.countryService.findAllDistricts(queryDistrictDto);
    return new ResponseRequest(res, result, msgResponse.getAllDistrict);
  }

  @Get('/wards')
  async getWardAlls(@Res() res: Response): Promise<ResponseRequest> {
    const result = await this.countryService.findAllWards();
    return new ResponseRequest(res, result, msgResponse.getAllWard);
  }

  @Get('/:id')
  async find(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.countryService.findOneCountry(id);
    return new ResponseRequest(res, result, msgResponse.getByIdCountry);
  }

  @Post('/init-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async initCountries(@Res() res: Response): Promise<ResponseRequest> {
    const data = readFileJson('countries.json');
    const result = await this.countryService.initCountries(data);
    return new ResponseRequest(res, result, msgResponse.initCountries);
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async update(
    @Param('id') id: string,
    @Body() updateCountriesDto: UpdateCountriesDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.countryService.updateCountry(
      id,
      updateCountriesDto,
    );
    return new ResponseRequest(res, result, msgResponse.updateCountry);
  }

  @Post('/province/init-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async initProvince(@Res() res: Response): Promise<ResponseRequest> {
    const data = readFileJson('province.json');
    const result = await this.countryService.initProvinces(data);
    return new ResponseRequest(res, result, msgResponse.initProvince);
  }

  @Post('/district/init-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async initDistrict(@Res() res: Response): Promise<ResponseRequest> {
    const data = readFileJson('district.json');
    const result = await this.countryService.initDisTricts(data);
    return new ResponseRequest(res, result, msgResponse.initDistrict);
  }

  @Post('/ward/init-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async initWard(@Res() res: Response): Promise<ResponseRequest> {
    const data = readFileJson('ward.json');
    const result = await this.countryService.initWards(data);
    return new ResponseRequest(res, result, msgResponse.initWard);
  }
}
