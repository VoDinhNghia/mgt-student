import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ErolesUser } from 'src/constants/constant';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role-auth.guard';
import { CreateFacultyDto } from './dtos/faculties.create.dto';
import { FacultiesService } from './faculties.service';
import { Response } from 'express';
import { ResponseRequest } from 'src/utils/response-api';
import { FacultyQueryDto } from './dtos/faculties.query.dto';
import { UpdateFacultyDto } from './dtos/faculties.update.dto';
import { CreateMajorDto } from './dtos/major.create.dto';
import { UpdateMajorDto } from './dtos/major.update.dto';
import { MajorQueryDto } from './dtos/major.query.dto';

@Controller('api/faculties')
@ApiTags('faculties')
export class FacultiesController {
  constructor(private readonly facultyService: FacultiesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async createFaculty(
    @Res() res: Response,
    @Body() createFacultyDto: CreateFacultyDto,
  ): Promise<ResponseRequest> {
    const result = await this.facultyService.createFaculty(createFacultyDto);
    return new ResponseRequest(res, result, 'Create faculty success');
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async updateFaculty(
    @Param('id') id: string,
    @Body() updateFacultyDto: UpdateFacultyDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.facultyService.updateFaculty(
      id,
      updateFacultyDto,
    );
    return new ResponseRequest(res, result, 'Update faculty success.');
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async getListFaculties(
    @Query() facultyQueryDto: FacultyQueryDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.facultyService.findAllFaculties(facultyQueryDto);
    return new ResponseRequest(res, result, 'Get faculties list success');
  }

  @Post('/major')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async createMajor(
    @Res() res: Response,
    @Body() createMajorDto: CreateMajorDto,
  ): Promise<ResponseRequest> {
    const result = await this.facultyService.createMajor(createMajorDto);
    return new ResponseRequest(res, result, 'Create major success');
  }

  @Put('/major/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async updateMajor(
    @Param('id') id: string,
    @Body() updateMajorDto: UpdateMajorDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.facultyService.updateMajor(id, updateMajorDto);
    return new ResponseRequest(res, result, 'Update major success.');
  }

  @Get('/major/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async getMajorById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.facultyService.findMajorById(id);
    return new ResponseRequest(res, result, 'Get major by id success');
  }

  @Get('/major')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async getListMajors(
    @Query() queryDto: MajorQueryDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.facultyService.findAllMajors(queryDto);
    return new ResponseRequest(res, result, 'Get majors list success');
  }

  @Get('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async getFacultyById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.facultyService.findFacultyById(id);
    return new ResponseRequest(res, result, 'Get faculty by id success');
  }

  // get all list subject of major by semester
}
