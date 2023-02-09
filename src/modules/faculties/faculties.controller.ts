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
import { CreateFacultyDto } from './dtos/faculties.create.dto';
import { FacultiesService } from './faculties.service';
import { Response } from 'express';

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
  ) {
    const result = await this.facultyService.createFaculty(createFacultyDto);
    res.status(HttpStatus.OK).json({
      statusCode: 200,
      data: result,
      message: 'Create faculty success.',
    });
  }
}
