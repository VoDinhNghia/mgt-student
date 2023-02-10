import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { roleTypeAccessApi } from 'src/commons/constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role-auth.guard';
import { UnionsService } from './unions.service';
import { Response } from 'express';
import { UnionCreateDto } from './dtos/unions.create.dto';
import { ResponseRequest } from 'src/abstracts/responseApi';

@Controller('unions')
@ApiTags('unions')
export class UnionsController {
  constructor(private readonly unionService: UnionsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async create(
    @Body() unionCreateDto: UnionCreateDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.unionService.createUnion(unionCreateDto);
    return new ResponseRequest(res, result, 'Create union success');
  }
}
