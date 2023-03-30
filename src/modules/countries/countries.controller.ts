import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Res,
  Req,
  Query,
} from '@nestjs/common';
import { UpdateCountriesDto } from './dto/countries.update.dto';
import { CountriesService } from './countries.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/auth.jwt-auth.guard';
import { Response, Request } from 'express';
import { QueryPovinceDto } from './dto/countries.query-province.dto';
import { QueryDistrictDto } from './dto/countries.query-district.dto';
import { ResponseRequest } from 'src/utils/utils.response-api';
import { RoleGuard } from '../auth/guards/auth.role-auth.guard';
import { ErolesUser } from 'src/constants/constant';
import { countriesMsg } from 'src/constants/constants.message.response';
import { readFileJson } from 'src/utils/utils.file.read-json';
import { countriesController } from 'src/constants/constants.controller.name-tag';
import { UserLoginResponseDto } from '../auth/dtos/auth.result.login-service.dto';
import { QueryCountriesDto } from './dto/countries.query.dto';
import { QueryWardDto } from './dto/countries.query-ward.dto';

@Controller(countriesController.name)
@ApiTags(countriesController.tag)
export class CountriesController {
  constructor(private readonly countryService: CountriesService) {}

  @Get()
  async getAlls(
    @Query() queryDto: QueryCountriesDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const data = await this.countryService.findAllCountry(queryDto);
    return new ResponseRequest(res, data, countriesMsg.getAllCountries);
  }

  @Get('/provinces')
  async getPovinceAlls(
    @Query() queryPovinceDto: QueryPovinceDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.countryService.findAllProvinces(queryPovinceDto);
    return new ResponseRequest(res, result, countriesMsg.getAllProvince);
  }

  @Get('/districts')
  async getDistrictAlls(
    @Query() queryDistrictDto: QueryDistrictDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.countryService.findAllDistricts(queryDistrictDto);
    return new ResponseRequest(res, result, countriesMsg.getAllDistrict);
  }

  @Get('/wards')
  async getWardAlls(
    @Query() queryDto: QueryWardDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.countryService.findAllWards(queryDto);
    return new ResponseRequest(res, result, countriesMsg.getAllWard);
  }

  @Get('/:id')
  async find(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.countryService.findOneCountry(id);
    return new ResponseRequest(res, result, countriesMsg.getByIdCountry);
  }

  @Post('/init-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async initCountries(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const createdBy: string = user?.profileId;
    const data = readFileJson('countries.json');
    const result = await this.countryService.initCountries(data, createdBy);
    return new ResponseRequest(res, result, countriesMsg.initCountries);
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
    return new ResponseRequest(res, result, countriesMsg.updateCountry);
  }

  @Post('/province/init-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async initProvince(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const createdBy: string = user?.profileId;
    const data = readFileJson('province.json');
    const result = await this.countryService.initProvinces(data, createdBy);
    return new ResponseRequest(res, result, countriesMsg.initProvince);
  }

  @Post('/district/init-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async initDistrict(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const createdBy: string = user?.profileId;
    const data = readFileJson('district.json');
    const result = await this.countryService.initDisTricts(data, createdBy);
    return new ResponseRequest(res, result, countriesMsg.initDistrict);
  }

  @Post('/ward/init-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async initWard(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const createdBy: string = user?.profileId;
    const data = readFileJson('ward.json');
    const result = await this.countryService.initWards(data, createdBy);
    return new ResponseRequest(res, result, countriesMsg.initWard);
  }
}
