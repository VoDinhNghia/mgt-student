import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Res,
  Req,
  Query,
  UseGuards,
  UseInterceptors,
  Delete,
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
import { classMsg } from 'src/constants/constants.message.response';
import { UserLoginResponseDto } from '../auth/dtos/auth.result.login-service.dto';
import { classSubjectController } from 'src/constants/constants.controller.name-tag';
import { QueryClassDto } from './dtos/class-subject.query-class.dto';

@Controller(classSubjectController.name)
@ApiTags(classSubjectController.tag)
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
    return new ResponseRequest(res, result, classMsg.create);
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
    return new ResponseRequest(res, result, classMsg.createSubject);
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
    return new ResponseRequest(res, result, classMsg.updateSubject);
  }

  @Delete('/subject/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async deleteSubject(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const deletedBy: string = user.profileId;
    await this.classSubjectService.deleteSubject(id, deletedBy);
    return new ResponseRequest(res, true, classMsg.deleteSubject);
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
    return new ResponseRequest(res, result, classMsg.update);
  }

  @Get('/class/:id')
  async getCalss(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.classSubjectService.findClassById(id);
    return new ResponseRequest(res, result, classMsg.getById);
  }

  @Get('/class')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getAllCalss(
    @Query() queryDto: QueryClassDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.classSubjectService.findAllClasses(queryDto);
    return new ResponseRequest(res, result, classMsg.getAll);
  }

  @Get('/subject')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getAllSubjects(
    @Query() queryDto: QueryClassDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.classSubjectService.findAllSubjects(queryDto);
    return new ResponseRequest(res, result, classMsg.getAllSubject);
  }

  @Get('/subject/:id')
  async getSubject(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.classSubjectService.findSubjectById(id);
    return new ResponseRequest(res, result, classMsg.getByIdSubject);
  }
}
