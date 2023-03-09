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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role-auth.guard';
import { DegreelevelService } from './degreelevels.service';
import { CreateDegreeLevelDto } from './dtos/degreelevels.create.dto';
import { Response } from 'express';
import { UpdateDegreeLevelDto } from './dtos/degreeLevels.update.dto';

@Controller('api/degreelevels')
@ApiTags('degreelevels')
export class DegreelevelController {
  constructor(private readonly degreeLevelService: DegreelevelService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.ADMIN]))
  async createDegreeLevel(
    @Body() degreeLevelDto: CreateDegreeLevelDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.degreeLevelService.createDegreeLevel(
      degreeLevelDto,
    );
    return new ResponseRequest(res, result, 'Create degreeLevel success.');
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.ADMIN]))
  async updateDegreeLevel(
    @Param('id') id: string,
    @Body() degreeLevelDto: UpdateDegreeLevelDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.degreeLevelService.updateDegreeLevel(
      id,
      degreeLevelDto,
    );
    return new ResponseRequest(res, result, 'Create degreeLevel success.');
  }

  @Get()
  async getAllDegreeLevel(@Res() res: Response): Promise<ResponseRequest> {
    const result = await this.degreeLevelService.findAllDegreeLevel();
    return new ResponseRequest(res, result, 'Get all degreeLevel success.');
  }

  @Get('/:id')
  async getDegreeLevelById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.degreeLevelService.findDegreeLevelById(id);
    return new ResponseRequest(res, result, 'Get all degreeLevel success.');
  }
}
