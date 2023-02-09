import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { roleTypeAccessApi } from 'src/commons/constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role-auth.guard';
import { ClassSubjectService } from './class-subject.service';
import { Response } from 'express';
import { CreateClassDto } from './dtos/class-subject.create-class.dto';

@Controller('class-subject')
@ApiTags('class-subject')
export class ClassSubjectController {
  constructor(private readonly classSubjectService: ClassSubjectService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async createBranch(
    @Res() res: Response,
    @Body() createClassDto: CreateClassDto,
  ) {
    const result = await this.classSubjectService.createClass(createClassDto);
    res.status(HttpStatus.OK).json({
      statusCode: 200,
      data: result,
      message: 'Create class success.',
    });
  }
}
