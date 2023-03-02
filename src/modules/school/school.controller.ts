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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role-auth.guard';
import { CreateSchoolDto } from './dtos/school.create.dto';
import { UpdateSchoolDto } from './dtos/school.update.dto';
import { SchoolService } from './school.service';
import { Response } from 'express';
import { ResponseRequest } from 'src/utils/responseApi';
import { roleTypeAccessApi } from 'src/constants/constant';

@Controller('api/school')
@ApiTags('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {
    const schoolDto: CreateSchoolDto = {
      name: 'Dai Hoc Cong Nghiep TP. HCM',
      schoolCode: 'IUH',
      numberTotal: 40000,
      yearFound: '2023-02-25',
      contactInfo: {
        email: 'iuh@gmail.com',
        fax: '',
        mobile: '0393993939',
      },
    };
    this.schoolService.createSchool(schoolDto);
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
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
