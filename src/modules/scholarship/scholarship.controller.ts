import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ErolesUser } from 'src/constants/constant';
import { ResponseRequest } from 'src/utils/responseApi';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role-auth.guard';
import { CreateUserScholarshipInSemester } from './dtos/admin.create.user-scholarship.semester.dto';
import { CreateScholarshipDto } from './dtos/scholarship.create.dto';
import { ScholarshipService } from './scholarship.service';

@Controller('api/scholarships')
@ApiTags('scholarships')
export class ScholarshipController {
  constructor(private readonly service: ScholarshipService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.ADMIN]))
  async createScholarship(
    @Body() dto: CreateScholarshipDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.service.createScholarship(dto);
    return new ResponseRequest(res, result, 'Create scholarship success.');
  }

  @Post('/user')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.ADMIN]))
  async createUserScholarshipInSemester(
    @Body() dto: CreateUserScholarshipInSemester,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.service.createUserScholarshipInSemester(
      dto.semester,
    );
    return new ResponseRequest(res, result, 'Create user scholarship success.');
  }
}
