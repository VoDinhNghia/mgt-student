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
import { BranchService } from './branchs.service';
import { Response } from 'express';
import { BranchCreateDto } from './dtos/branchs.create.dto';
import { BranchQueryDto } from './dtos/branchs.query.dto';
import { BranchUpdateDto } from './dtos/branchs.update.dto';
import { ResponseRequest } from 'src/utils/response-api';

@Controller('api/branchs')
@ApiTags('branchs')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.ADMIN]))
  async createBranch(
    @Res() res: Response,
    @Body() branchCreateDto: BranchCreateDto,
  ): Promise<ResponseRequest> {
    const result = await this.branchService.createBranchNew(branchCreateDto);
    return new ResponseRequest(res, result, `Create branch success.`);
  }

  @Get()
  async getAllBranchs(
    @Query() branchQueryDto: BranchQueryDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.branchService.findAllBranchs(branchQueryDto);
    return new ResponseRequest(res, result, `Get all branchs success.`);
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.ADMIN]))
  async updateBranch(
    @Param('id') id: string,
    @Body() updateBranchDto: BranchUpdateDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    await this.branchService.updateBranch(id, updateBranchDto);
    return new ResponseRequest(res, true, `Update branch success.`);
  }

  @Get('/:id')
  async getBranchById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.branchService.findById(id);
    return new ResponseRequest(res, result, `Get branch by id success.`);
  }
}
