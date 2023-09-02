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
  private countriesFile: string = 'countries.json';
  private provinceFile: string = 'province.json';
  private districtFile: string = 'district.json';
  private wardFile: string = 'ward.json';

  constructor(private readonly countryService: CountriesService) {}

  @Get()
  public async getAlls(
    @Query() queryDto: QueryCountriesDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const data = await this.countryService.findAllCountry(queryDto);

    return new ResponseRequest(res, data, countriesMsg.getAllCountries);
  }

  @Get('/provinces')
  public async getPovinceAlls(
    @Query() queryPovinceDto: QueryPovinceDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.countryService.findAllProvinces(queryPovinceDto);

    return new ResponseRequest(res, result, countriesMsg.getAllProvince);
  }

  @Get('/districts')
  public async getDistrictAlls(
    @Query() queryDistrictDto: QueryDistrictDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.countryService.findAllDistricts(queryDistrictDto);

    return new ResponseRequest(res, result, countriesMsg.getAllDistrict);
  }

  @Get('/wards')
  public async getWardAlls(
    @Query() queryDto: QueryWardDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.countryService.findAllWards(queryDto);

    return new ResponseRequest(res, result, countriesMsg.getAllWard);
  }

  @Get('/:id')
  public async find(
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
  public async initCountries(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const data = readFileJson(this.countriesFile);
    const result = await this.countryService.initCountries(data, profileId);

    return new ResponseRequest(res, result, countriesMsg.initCountries);
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async update(
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
  public async initProvince(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const data = readFileJson(this.provinceFile);
    const result = await this.countryService.initProvinces(data, profileId);

    return new ResponseRequest(res, result, countriesMsg.initProvince);
  }

  @Post('/district/init-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async initDistrict(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const data = readFileJson(this.districtFile);
    const result = await this.countryService.initDisTricts(data, profileId);

    return new ResponseRequest(res, result, countriesMsg.initDistrict);
  }

  @Post('/ward/init-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async initWard(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const data = readFileJson(this.wardFile);
    const result = await this.countryService.initWards(data, profileId);

    return new ResponseRequest(res, result, countriesMsg.initWard);
  }
}
