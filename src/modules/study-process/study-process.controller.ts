import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { StudyProcessService } from './study-process.service';
import { studyProcessController } from 'src/constants/constants.controller.name-tag';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/auth.jwt-auth.guard';
import { Response, Request } from 'express';
import { ResponseRequest } from 'src/utils/utils.response-api';
import { studyProcessMsg } from 'src/constants/constants.message.response';
import { RoleGuard } from '../auth/guards/auth.role-auth.guard';
import { ErolesUser } from 'src/constants/constant';
import { QueryStudyProcessDto } from './dtos/study-process.query.dto';
import { QueryStudyProcessByStudent } from './dtos/study-process.query-by-user.dto';
import { UserLoginResponseDto } from '../auth/dtos/auth.result.login-service.dto';
import { CreateStudySubjectProcessDto } from './dtos/study-process.create.subject-register.dto';
import { UpdatePointSubjectRegisterDto } from './dtos/study-process.update-point.subject.dto';

@Controller(studyProcessController.name)
@ApiTags(studyProcessController.tag)
export class StudyProcessController {
  constructor(private readonly service: StudyProcessService) {}

  @Post('/register-subject')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.STUDENT]))
  async registerSubject(
    @Body() createDto: CreateStudySubjectProcessDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const createdBy: string = user?.profileId;
    const result = await this.service.createSubjectRegister(
      createDto,
      createdBy,
    );
    return new ResponseRequest(
      res,
      result,
      studyProcessMsg.createSubjectRegister,
    );
  }

  @Put('/register-subject/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.LECTURER]))
  async updateSubjectPoint(
    @Param('id') id: string,
    @Body() updateDto: UpdatePointSubjectRegisterDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const updatedBy: string = user?.profileId;
    const result = await this.service.updatePointSubjectRegister(
      id,
      updateDto,
      updatedBy,
    );
    return new ResponseRequest(
      res,
      result,
      studyProcessMsg.updateSubjectRegister,
    );
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async getAllStudyProcess(
    @Query() queryDto: QueryStudyProcessDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const results = await this.service.findAllStudyProcess(queryDto);
    return new ResponseRequest(res, results, studyProcessMsg.getAll);
  }

  @Get('/student')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getAllStudyProcessByStudent(
    @Query() queryDto: QueryStudyProcessByStudent,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const studentId: string = user?.profileId;
    const results = await this.service.findAllStudyProcessByStudent(
      queryDto,
      studentId,
    );
    return new ResponseRequest(res, results, studyProcessMsg.getAll);
  }

  @Get('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getStudyProcessById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.service.findStudyProcessById(id);
    return new ResponseRequest(
      res,
      result,
      studyProcessMsg.getByIdStudyProcess,
    );
  }
}
