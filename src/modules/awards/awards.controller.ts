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
import { AwardsService } from './awards.service';
import { Response } from 'express';
import { ResponseRequest } from 'src/utils/responseApi';
import { CreateAwardDto } from './dtos/awards.create.dto';
import { UpdateAwardDto } from './dtos/awards.update.dto';
import { QueryAwardDto } from './dtos/awards.query.dto';

@Controller('api/awards')
@ApiTags('awards')
export class AwardsController {
  constructor(private readonly awardService: AwardsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.ADMIN]))
  async createAward(
    @Res() res: Response,
    @Body() createAwardDto: CreateAwardDto,
  ): Promise<ResponseRequest> {
    const result = await this.awardService.createAward(createAwardDto);
    return new ResponseRequest(res, result, `Create award success.`);
  }

  @Get()
  async getAllAward(
    @Query() queryAwardDto: QueryAwardDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.awardService.findAllAward(queryAwardDto);
    return new ResponseRequest(res, result, `Get all award success.`);
  }

  @Get('/:id')
  async getAwardById(
    @Res() res: Response,
    @Param('id') id: string,
  ): Promise<ResponseRequest> {
    const result = await this.awardService.findAwardById(id);
    return new ResponseRequest(res, result, `Get award by Id sucess.`);
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.ADMIN]))
  async updateAward(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateAwardDto: UpdateAwardDto,
  ): Promise<ResponseRequest> {
    await this.awardService.updateAward(id, updateAwardDto);
    return new ResponseRequest(res, true, `Update award success.`);
  }
}
