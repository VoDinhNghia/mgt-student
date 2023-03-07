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
import { ErolesUser } from 'src/constants/constant';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role-auth.guard';
import { UnionsService } from './unions.service';
import { Response } from 'express';
import { CreateUnionDto } from './dtos/unions.create.dto';
import { ResponseRequest } from 'src/utils/response-api';
import { UpdateUnionDto } from './dtos/unions.update.dto';

@Controller('api/unions')
@ApiTags('unions')
export class UnionsController {
  constructor(private readonly unionService: UnionsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.ADMIN]))
  async create(
    @Body() unionDto: CreateUnionDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.unionService.createUnion(unionDto);
    return new ResponseRequest(res, result, 'Create union success');
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.ADMIN]))
  async updateUnion(
    @Param('id') id: string,
    @Body() unionDto: UpdateUnionDto,
    @Res() res: ResponseRequest,
  ): Promise<ResponseRequest> {
    const result = await this.unionService.updateUnion(id, unionDto);
    return new ResponseRequest(res, result, 'Update union success.');
  }

  @Get()
  async getAllUnion(@Res() res: ResponseRequest): Promise<ResponseRequest> {
    const results = await this.unionService.findAllUnions();
    return new ResponseRequest(res, results, 'Get all union success');
  }

  @Get('/:id')
  async getUnionById(
    @Param('id') id: string,
    @Res() res: ResponseRequest,
  ): Promise<ResponseRequest> {
    const result = await this.unionService.findUnionById(id);
    return new ResponseRequest(res, result, 'Get union by id success.');
  }
}
