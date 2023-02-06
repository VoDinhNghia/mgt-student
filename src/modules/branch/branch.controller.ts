import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { roleTypeAccessApi } from 'src/commons/constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role-auth.guard';
import { BranchService } from './branch.service';
import { Response } from 'express';
import { BranchCreateDto } from './dtos/branch.create.dto';
import { BranchQueryDto } from './dtos/branch.query.dto';
import { BranchUpdateDto } from './dtos/branch.update.dto';

@Controller('branchs')
@ApiTags('branchs')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async createBranch(
    @Res() res: Response,
    @Body() branchCreateDto: BranchCreateDto,
  ) {
    const result = await this.branchService.createBranchNew(branchCreateDto);
    res.status(HttpStatus.OK).json({
      statusCode: 200,
      data: result,
      message: 'Create branch success.',
    });
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.FULL))
  async getAllBranchs(
    @Query() branchQueryDto: BranchQueryDto,
    @Res() res: Response,
  ) {
    const result = await this.branchService.findAllBranchs(branchQueryDto);
    res.status(HttpStatus.OK).json({
      statusCode: 200,
      data: result,
      message: 'Get all branchs success.',
    });
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async updateBranch(
    @Param('id') id: string,
    @Body() updateBranchDto: BranchUpdateDto,
    @Res() res: Response,
  ) {
    await this.branchService.updateBranch(id, updateBranchDto);
    res.status(HttpStatus.OK).json({
      statusCode: 200,
      data: true,
      message: 'Update branch success.',
    });
  }

  @Get('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.FULL))
  async getBranchById(@Param('id') id: string, @Res() res: Response) {
    const result: any = await this.branchService.findById(id);
    res.status(HttpStatus.OK).json({
      statusCode: 200,
      data: result,
      message: 'Get branch by id success.',
    });
  }
}
