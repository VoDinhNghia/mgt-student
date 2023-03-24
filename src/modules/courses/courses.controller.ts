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
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseRequest } from 'src/utils/response-api';
import { ErolesUser } from 'src/constants/constant';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role-auth.guard';
import { Response, Request } from 'express';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dtos/courses.create.dto';
import { UpdateCourseDto } from './dtos/courses.update.dto';
import { msgResponse } from 'src/constants/message.response';

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
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const { user }: Request | Record<string, any> = req;
    const createdBy: string = user.profileId;
    const result = await this.courseService.createCourse(courseDto, createdBy);
    return new ResponseRequest(res, result, msgResponse.createCourse);
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async updateCourse(
    @Param('id') id: string,
    @Body() courseDto: UpdateCourseDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const { user }: Request | Record<string, any> = req;
    const updatedBy: string = user.profileId;
    const result = await this.courseService.updateCourse(
      id,
      courseDto,
      updatedBy,
    );
    return new ResponseRequest(res, result, msgResponse.updateCourse);
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
    return new ResponseRequest(res, result, msgResponse.getByIdCourse);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getListFaculties(@Res() res: Response): Promise<ResponseRequest> {
    const result = await this.courseService.findAllCourses();
    return new ResponseRequest(res, result, msgResponse.getAllCourse);
  }
}
