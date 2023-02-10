import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseRequest } from 'src/abstracts/responseApi';
import { roleTypeAccessApi } from 'src/commons/constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role-auth.guard';
import { CountriesService } from '../countries/countries.service';
import { Response } from 'express';

@Controller('courses')
@ApiTags('cources')
export class CoursesController {
  constructor(private readonly courseService: CountriesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async createCourse(@Res() res: Response): Promise<ResponseRequest> {
    return new ResponseRequest(res, 'OK', 'Create cource success');
  }
}
