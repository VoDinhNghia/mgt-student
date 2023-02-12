import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { roleTypeAccessApi } from 'src/commons/constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role-auth.guard';
import { AwardsService } from './awards.service';
import { Response } from 'express';
import { ResponseRequest } from 'src/abstracts/responseApi';
import { CreateAwardDto } from './dtos/awards.create.dto';

@Controller('awards')
@ApiTags('awards')
export class AwardsController {
  constructor(private readonly awardService: AwardsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async createAward(
    @Res() res: Response,
    @Body() createAwardDto: CreateAwardDto,
  ): Promise<ResponseRequest> {
    const result = await this.awardService.createAward(createAwardDto);
    return new ResponseRequest(res, result, `Create award success.`);
  }
}
