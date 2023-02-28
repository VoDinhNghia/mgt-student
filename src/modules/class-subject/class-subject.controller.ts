import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { roleTypeAccessApi } from 'src/commons/constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role-auth.guard';
import { ClassSubjectService } from './class-subject.service';
import { Response } from 'express';
import { CreateClassDto } from './dtos/class.create.dto';
import { ResponseRequest } from 'src/abstracts/responseApi';
import { CreateSubjectDto } from './dtos/subject.create.dto';
import { UpdateSubjectDto } from './dtos/subject.update.dto';
import { UpdateClassDto } from './dtos/class.update.dto';

@Controller('api/class-subject')
@ApiTags('class-subject')
export class ClassSubjectController {
  constructor(private readonly classSubjectService: ClassSubjectService) {}

  @Post('/class')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async createClass(
    @Res() res: Response,
    @Body() createClassDto: CreateClassDto,
  ): Promise<ResponseRequest> {
    const result = await this.classSubjectService.createClass(createClassDto);
    return new ResponseRequest(res, result, `Create class success.`);
  }

  @Post('/subject')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async createSubject(
    @Res() res: Response,
    @Body() subjectDto: CreateSubjectDto,
  ): Promise<ResponseRequest> {
    const result = await this.classSubjectService.createSubject(subjectDto);
    return new ResponseRequest(res, result, `Create subject success.`);
  }

  @Put('/subject/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async updateSubject(
    @Param('id') id: string,
    @Res() res: Response,
    @Body() subjectDto: UpdateSubjectDto,
  ): Promise<ResponseRequest> {
    const result = await this.classSubjectService.updateSubject(id, subjectDto);
    return new ResponseRequest(res, result, `Update subject success.`);
  }

  @Put('/class/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async updateCalss(
    @Param('id') id: string,
    @Res() res: Response,
    @Body() classDto: UpdateClassDto,
  ): Promise<ResponseRequest> {
    const result = await this.classSubjectService.updateClass(id, classDto);
    return new ResponseRequest(res, result, `Update class success.`);
  }

  @Get('/class/:id')
  async getCalss(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.classSubjectService.findClassById(id);
    return new ResponseRequest(res, result, `Get class success.`);
  }

  @Get('/subject/:id')
  async getSubject(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.classSubjectService.findSubjectById(id);
    return new ResponseRequest(res, result, `Get subject success.`);
  }
}
