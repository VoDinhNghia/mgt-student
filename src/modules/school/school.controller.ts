import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role-auth.guard';
import { CreateSchoolDto } from './dtos/school.create.dto';
import { UpdateSchoolDto } from './dtos/school.update.dto';
import { SchoolService } from './school.service';
import { Response, Request } from 'express';
import { ResponseRequest } from 'src/utils/response-api';
import { ErolesUser } from 'src/constants/constant';
import { GetCurrentDate } from 'src/utils/get.current-date';
import { msgResponse } from 'src/constants/message.response';
import { UserLoginResponseDto } from '../auth/dtos/auth.result.login-service.dto';

@Controller('api/school')
@ApiTags('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {
    const schoolDto: CreateSchoolDto = {
      name: 'University Name', // ex: Industrial University of Ho Chi Minh City
      schoolCode: 'University_Code',
      numberTotal: 40000,
      yearFound: new Date(new GetCurrentDate().getYearMonthDate()),
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
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const updatedBy: string = user.profileId;
    const result = await this.schoolService.updateSchool(
      id,
      schoolDto,
      updatedBy,
    );
    return new ResponseRequest(res, result, msgResponse.updateSchool);
  }

  @Get()
  async getAllSchool(@Res() res: Response): Promise<ResponseRequest> {
    const result = await this.schoolService.findAllSchool();
    return new ResponseRequest(res, result, msgResponse.getAllSchool);
  }

  @Get('/:id')
  async getSchool(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.schoolService.findSchoolById(id);
    return new ResponseRequest(res, result, msgResponse.getByIdSchool);
  }
}
