import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ErolesUser } from 'src/constants/constant';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role-auth.guard';
import { BranchService } from './branchs.service';
import { Response, Request } from 'express';
import { BranchCreateDto } from './dtos/branchs.create.dto';
import { BranchQueryDto } from './dtos/branchs.query.dto';
import { BranchUpdateDto } from './dtos/branchs.update.dto';
import { ResponseRequest } from 'src/utils/response-api';
import { msgResponse } from 'src/constants/message.response';
import { UserLoginResponseDto } from '../auth/dtos/auth.result.login-service.dto';

@Controller('api/branchs')
@ApiTags('branchs')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async createBranch(
    @Res() res: Response,
    @Body() branchCreateDto: BranchCreateDto,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const createdBy: string = user.profileId;
    const result = await this.branchService.createBranchNew(
      branchCreateDto,
      createdBy,
    );
    return new ResponseRequest(res, result, msgResponse.createBranch);
  }

  @Get()
  async getAllBranchs(
    @Query() branchQueryDto: BranchQueryDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.branchService.findAllBranchs(branchQueryDto);
    return new ResponseRequest(res, result, msgResponse.getAllBranch);
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async updateBranch(
    @Param('id') id: string,
    @Body() updateBranchDto: BranchUpdateDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const updatedBy: string = user.profileId;
    await this.branchService.updateBranch(id, updateBranchDto, updatedBy);
    return new ResponseRequest(res, true, msgResponse.updateBranch);
  }

  @Get('/:id')
  async getBranchById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.branchService.findById(id);
    return new ResponseRequest(res, result, msgResponse.getByIdBranch);
  }
}
