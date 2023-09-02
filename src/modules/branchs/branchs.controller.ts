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
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ErolesUser } from 'src/constants/constant';
import { JwtAuthGuard } from '../auth/guards/auth.jwt-auth.guard';
import { RoleGuard } from '../auth/guards/auth.role-auth.guard';
import { BranchService } from './branchs.service';
import { Response, Request } from 'express';
import { BranchCreateDto } from './dtos/branchs.create.dto';
import { BranchQueryDto } from './dtos/branchs.query.dto';
import { BranchUpdateDto } from './dtos/branchs.update.dto';
import { ResponseRequest } from 'src/utils/utils.response-api';
import { branchMsg } from 'src/constants/constants.message.response';
import { UserLoginResponseDto } from '../auth/dtos/auth.result.login-service.dto';
import { branchController } from 'src/constants/constants.controller.name-tag';

@Controller(branchController.name)
@ApiTags(branchController.tag)
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async createBranch(
    @Res() res: Response,
    @Body() branchCreateDto: BranchCreateDto,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const result = await this.branchService.createBranchNew(
      branchCreateDto,
      profileId,
    );

    return new ResponseRequest(res, result, branchMsg.create);
  }

  @Get()
  public async getAllBranchs(
    @Query() branchQueryDto: BranchQueryDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.branchService.findAllBranchs(branchQueryDto);

    return new ResponseRequest(res, result, branchMsg.getAll);
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async updateBranch(
    @Param('id') id: string,
    @Body() updateBranchDto: BranchUpdateDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const result = await this.branchService.updateBranch(
      id,
      updateBranchDto,
      profileId,
    );

    return new ResponseRequest(res, result, branchMsg.update);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async deleteBranch(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    await this.branchService.deleteBranch(id, profileId);

    return new ResponseRequest(res, true, branchMsg.delete);
  }

  @Get('/:id')
  public async getBranchById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.branchService.findById(id);

    return new ResponseRequest(res, result, branchMsg.getById);
  }
}
