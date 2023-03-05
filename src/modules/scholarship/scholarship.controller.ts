import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  Query,
  Param,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ErolesUser } from 'src/constants/constant';
import { ResponseRequest } from 'src/utils/responseApi';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role-auth.guard';
import { CreateUserScholarshipInSemester } from './dtos/admin.create.user-scholarship.semester.dto';
import { CreateScholarshipDto } from './dtos/scholarship.create.dto';
import { QueryScholarshipDto } from './dtos/scholarship.query.dto';
import { QueryUserScholarshipDto } from './dtos/scholarship.user.query.dto';
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

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.ADMIN]))
  async updateScholarship(
    @Param('id') id: string,
    @Body() dto: CreateScholarshipDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.service.updateScholarship(id, dto);
    return new ResponseRequest(res, result, 'Update scholarship success.');
  }

  @Get()
  async getAllScholarship(
    @Query() queryDto: QueryScholarshipDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.service.findAllScholarship(queryDto);
    return new ResponseRequest(res, result, 'Get scholarships success.');
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

  @Get('/user')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(
    RoleGuard([
      ErolesUser.ADMIN,
      ErolesUser.ACCOUNTANT,
      ErolesUser.LECTURER,
      ErolesUser.STUDENT,
    ]),
  )
  async getUserScholarship(
    @Query() dto: QueryUserScholarshipDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.service.findAllUserScholarShip(dto);
    return new ResponseRequest(res, result, 'Get user scholarship success.');
  }

  @Get('/:id')
  async getScholarshipById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.service.findScholarshipById(id);
    return new ResponseRequest(res, result, 'Get scholarship success.');
  }
}
