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
import { JwtAuthGuard } from '../auth/guards/auth.jwt-auth.guard';
import { RoleGuard } from '../auth/guards/auth.role-auth.guard';
import { CreateSchoolDto } from './dtos/school.create.dto';
import { UpdateSchoolDto } from './dtos/school.update.dto';
import { SchoolService } from './school.service';
import { Response, Request } from 'express';
import { ResponseRequest } from 'src/utils/utils.response-api';
import { ErolesUser } from 'src/constants/constant';
import { GetCurrentDate } from 'src/utils/utils.get.current-date';
import { schoolMsg } from 'src/constants/constants.message.response';
import { UserLoginResponseDto } from '../auth/dtos/auth.result.login-service.dto';
import { schoolController } from 'src/constants/constants.controller.name-tag';

@Controller(schoolController.name)
@ApiTags(schoolController.tag)
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
    (async () => {
      await this.schoolService.createSchool(schoolDto);
    })();
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async updateSchool(
    @Param('id') id: string,
    @Body() schoolDto: UpdateSchoolDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const result = await this.schoolService.updateSchool(
      id,
      schoolDto,
      profileId,
    );

    return new ResponseRequest(res, result, schoolMsg.update);
  }

  @Get()
  public async getAllSchool(@Res() res: Response): Promise<ResponseRequest> {
    const result = await this.schoolService.findSchoolInfo();

    return new ResponseRequest(res, result, schoolMsg.getSchoolInfo);
  }
}
