import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseRequest } from 'src/abstracts/responseApi';
import { roleTypeAccessApi } from 'src/commons/constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role-auth.guard';
import { Response } from 'express';
import { CoursesService } from './courses.service';
import { CourseCreateDto } from './dtos/courses.create.dto';

@Controller('api/courses')
@ApiTags('cources')
export class CoursesController {
  constructor(private readonly courseService: CoursesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async createCourse(
    @Res() res: Response,
    @Body() courseCreateDto: CourseCreateDto,
  ): Promise<ResponseRequest> {
    const result = await this.courseService.createCourse(courseCreateDto);
    return new ResponseRequest(res, result, 'Create cource success');
  }
}
