import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { roleTypeAccessApi } from 'src/commons/constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role-auth.guard';
import { ClassSubjectService } from './class-subject.service';
import { Response } from 'express';
import { CreateClassDto } from './dtos/class.create.dto';
import { ResponseRequest } from 'src/abstracts/responseApi';

@Controller('api/class-subject')
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
  ): Promise<ResponseRequest> {
    const result = await this.classSubjectService.createClass(createClassDto);
    return new ResponseRequest(res, result, `Create class success.`);
  }
}
