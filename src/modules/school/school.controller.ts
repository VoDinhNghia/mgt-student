import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role-auth.guard';
import { CreateSchoolDto } from './dtos/school.create.dto';
import { UpdateSchoolDto } from './dtos/school.update.dto';
import { SchoolService } from './school.service';
import { Response } from 'express';
import { ResponseRequest } from 'src/utils/response-api';
import { ErolesUser } from 'src/constants/constant';

@Controller('api/school')
@ApiTags('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {
    const schoolDto: CreateSchoolDto = {
      name: 'University Name', // ex: Industrial University of Ho Chi Minh City
      schoolCode: 'University_Code',
      numberTotal: 40000,
      yearFound: '2023-02-25',
      contactInfo: {
        email: 'university@gmail.com',
        fax: '',
        mobile: '0393993939',
      },
    };
    this.schoolService.createSchool(schoolDto);
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async updateSchool(
    @Param('id') id: string,
    @Body() schoolDto: UpdateSchoolDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.schoolService.updateSchool(id, schoolDto);
    return new ResponseRequest(res, result, 'Update school success.');
  }

  @Get()
  async getAllSchool(@Res() res: Response): Promise<ResponseRequest> {
    const result = await this.schoolService.findAllSchool();
    return new ResponseRequest(res, result, 'Get all school success.');
  }

  @Get('/:id')
  async getSchool(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.schoolService.findSchoolById(id);
    return new ResponseRequest(res, result, 'Get school success.');
  }
}
