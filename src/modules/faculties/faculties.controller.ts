import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { roleTypeAccessApi } from 'src/commons/constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role-auth.guard';
import { CreateFacultyDto } from './dtos/faculties.create.dto';
import { FacultiesService } from './faculties.service';
import { Response } from 'express';
import { ResponseRequest } from 'src/abstracts/responseApi';
import { FacultyQueryDto } from './dtos/faculties.query.dto';

@Controller('faculties')
@ApiTags('faculties')
export class FacultiesController {
  constructor(private readonly facultyService: FacultiesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async createBranch(
    @Res() res: Response,
    @Body() createFacultyDto: CreateFacultyDto,
  ): Promise<ResponseRequest> {
    const result = await this.facultyService.createFaculty(createFacultyDto);
    return new ResponseRequest(res, result, 'Create faculty success');
  }

  @Get('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async getById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.facultyService.findFacultyById(id);
    return new ResponseRequest(res, result, 'Get faculty by id success');
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async getListFaculties(
    @Query() facultyQueryDto: FacultyQueryDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.facultyService.findAllFaculties(facultyQueryDto);
    return new ResponseRequest(res, result, 'Get faculties list success');
  }
}
