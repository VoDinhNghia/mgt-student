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
import { ResponseRequest } from 'src/utils/response-api';
import { ErolesUser } from 'src/constants/constant';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role-auth.guard';
import { Response } from 'express';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dtos/courses.create.dto';
import { UpdateCourseDto } from './dtos/courses.update.dto';

@Controller('api/courses')
@ApiTags('courses')
export class CoursesController {
  constructor(private readonly courseService: CoursesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async createCourse(
    @Res() res: Response,
    @Body() courseDto: CreateCourseDto,
  ): Promise<ResponseRequest> {
    const result = await this.courseService.createCourse(courseDto);
    return new ResponseRequest(res, result, 'Create cource success');
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async updateCourse(
    @Param('id') id: string,
    @Body() courseDto: UpdateCourseDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.courseService.updateCourse(id, courseDto);
    return new ResponseRequest(res, result, 'Update course success.');
  }

  @Get('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async getCourseById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.courseService.findCourseById(id);
    return new ResponseRequest(res, result, 'Get course by id success');
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getListFaculties(@Res() res: Response): Promise<ResponseRequest> {
    const result = await this.courseService.findAllCourses();
    return new ResponseRequest(res, result, 'Get course list success');
  }
}
