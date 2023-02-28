import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseRequest } from 'src/abstracts/responseApi';
import { roleTypeAccessApi } from 'src/commons/constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role-auth.guard';
import { CreateSemesterDto } from './dtos/semesters.create.dto';
import { SemestersService } from './semesters.service';
import { Response } from 'express';
import { UpdateSemesterDto } from './dtos/semesters.update.dto';

@Controller('api/semesters')
@ApiTags('semesters')
export class SemestersController {
  constructor(private readonly semesterService: SemestersService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async createSemester(
    @Body() semesterDto: CreateSemesterDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.semesterService.createSemester(semesterDto);
    return new ResponseRequest(res, result, 'Create Semester success.');
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async updateSemester(
    @Param('id') id: string,
    @Body() updateDto: UpdateSemesterDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.semesterService.updateSemester(id, updateDto);
    return new ResponseRequest(res, result, 'Update semester success.');
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async deleteSemester(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    await this.semesterService.deleteSemester(id);
    return new ResponseRequest(res, true, 'Delete semester success.');
  }

  @Get()
  async getAllSemester(@Res() res: Response): Promise<ResponseRequest> {
    const results = await this.semesterService.findAllSemesters();
    return new ResponseRequest(res, results, 'Get all semester success.');
  }

  @Get('/:id')
  async getSemesterById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.semesterService.findSemesterById(id);
    return new ResponseRequest(res, result, 'Get semester by id success.');
  }
}
