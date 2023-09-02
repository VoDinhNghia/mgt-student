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
  Query,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseRequest } from 'src/utils/utils.response-api';
import { ErolesUser } from 'src/constants/constant';
import { JwtAuthGuard } from '../auth/guards/auth.jwt-auth.guard';
import { RoleGuard } from '../auth/guards/auth.role-auth.guard';
import { Response, Request } from 'express';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dtos/courses.create.dto';
import { UpdateCourseDto } from './dtos/courses.update.dto';
import { courseMsg } from 'src/constants/constants.message.response';
import { UserLoginResponseDto } from '../auth/dtos/auth.result.login-service.dto';
import { courseController } from 'src/constants/constants.controller.name-tag';
import { QueryCourseDto } from './dtos/courses.query.dto';

@Controller(courseController.name)
@ApiTags(courseController.tag)
export class CoursesController {
  constructor(private readonly courseService: CoursesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async createCourse(
    @Res() res: Response,
    @Body() courseDto: CreateCourseDto,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const result = await this.courseService.createCourse(courseDto, profileId);

    return new ResponseRequest(res, result, courseMsg.create);
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async updateCourse(
    @Param('id') id: string,
    @Body() courseDto: UpdateCourseDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const result = await this.courseService.updateCourse(
      id,
      courseDto,
      profileId,
    );

    return new ResponseRequest(res, result, courseMsg.update);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async deleteCourse(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    await this.courseService.deleteCourse(id, profileId);

    return new ResponseRequest(res, true, courseMsg.delete);
  }

  @Get('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async getCourseById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.courseService.findCourseById(id);

    return new ResponseRequest(res, result, courseMsg.getById);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  public async getListFaculties(
    @Query() queryDto: QueryCourseDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.courseService.findAllCourses(queryDto);

    return new ResponseRequest(res, result, courseMsg.getAll);
  }
}
