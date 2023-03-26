import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Res,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ErolesUser } from 'src/constants/constant';
import { JwtAuthGuard } from '../auth/guards/auth.jwt-auth.guard';
import { RoleGuard } from '../auth/guards/auth.role-auth.guard';
import { ClassSubjectService } from './class-subject.service';
import { Response, Request } from 'express';
import { CreateClassDto } from './dtos/class-subject.create-class.dto';
import { ResponseRequest } from 'src/utils/utils.response-api';
import { CreateSubjectDto } from './dtos/class-subject.create-subject.dto';
import { UpdateSubjectDto } from './dtos/class-subject.update-subject.dto';
import { UpdateClassDto } from './dtos/class-subject.update-class.dto';
import { ValidatePercentPoint } from 'src/validates/validates.percent-point.subject';
import { msgResponse } from 'src/constants/message.response';
import { UserLoginResponseDto } from '../auth/dtos/auth.result.login-service.dto';

@Controller('api/class-subject')
@ApiTags('class-subject')
export class ClassSubjectController {
  constructor(private readonly classSubjectService: ClassSubjectService) {}

  @Post('/class')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async createClass(
    @Res() res: Response,
    @Body() createClassDto: CreateClassDto,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const createdBy: string = user.profileId;
    const result = await this.classSubjectService.createClass(
      createClassDto,
      createdBy,
    );
    return new ResponseRequest(res, result, msgResponse.createClass);
  }

  @Post('/subject')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  @UseInterceptors(ValidatePercentPoint)
  async createSubject(
    @Res() res: Response,
    @Body() subjectDto: CreateSubjectDto,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const createdBy: string = user.profileId;
    const result = await this.classSubjectService.createSubject(
      subjectDto,
      createdBy,
    );
    return new ResponseRequest(res, result, msgResponse.createSubject);
  }

  @Put('/subject/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async updateSubject(
    @Param('id') id: string,
    @Res() res: Response,
    @Body() subjectDto: UpdateSubjectDto,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const updatedBy: string = user.profileId;
    const result = await this.classSubjectService.updateSubject(
      id,
      subjectDto,
      updatedBy,
    );
    return new ResponseRequest(res, result, msgResponse.updateSubject);
  }

  @Put('/class/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async updateCalss(
    @Param('id') id: string,
    @Res() res: Response,
    @Body() classDto: UpdateClassDto,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const updatedBy: string = user.profileId;
    const result = await this.classSubjectService.updateClass(
      id,
      classDto,
      updatedBy,
    );
    return new ResponseRequest(res, result, msgResponse.updateClass);
  }

  @Get('/class/:id')
  async getCalss(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.classSubjectService.findClassById(id);
    return new ResponseRequest(res, result, msgResponse.getByIdClass);
  }

  @Get('/subject/:id')
  async getSubject(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.classSubjectService.findSubjectById(id);
    return new ResponseRequest(res, result, msgResponse.getByIdSubject);
  }
}
