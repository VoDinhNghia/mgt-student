import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  Query,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseRequest } from 'src/utils/utils.response-api';
import { ErolesUser } from 'src/constants/constant';
import { JwtAuthGuard } from '../auth/guards/auth.jwt-auth.guard';
import { RoleGuard } from '../auth/guards/auth.role-auth.guard';
import { DegreelevelService } from './degreelevels.service';
import { CreateDegreeLevelDto } from './dtos/degreelevels.create.dto';
import { Response, Request } from 'express';
import { UpdateDegreeLevelDto } from './dtos/degreeLevels.update.dto';
import { degreeLevelMsg } from 'src/constants/constants.message.response';
import { UserLoginResponseDto } from '../auth/dtos/auth.result.login-service.dto';
import { degreeLeveController } from 'src/constants/constants.controller.name-tag';
import { QueryDegreeLevelDto } from './dtos/degreelevels.query.dto';

@Controller(degreeLeveController.name)
@ApiTags(degreeLeveController.tag)
export class DegreelevelController {
  constructor(private readonly degreeLevelService: DegreelevelService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async createDegreeLevel(
    @Body() degreeLevelDto: CreateDegreeLevelDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const result = await this.degreeLevelService.createDegreeLevel(
      degreeLevelDto,
      profileId,
    );

    return new ResponseRequest(res, result, degreeLevelMsg.create);
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async updateDegreeLevel(
    @Param('id') id: string,
    @Body() degreeLevelDto: UpdateDegreeLevelDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const result = await this.degreeLevelService.updateDegreeLevel(
      id,
      degreeLevelDto,
      profileId,
    );

    return new ResponseRequest(res, result, degreeLevelMsg.update);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async deleteDegreeLevel(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    await this.degreeLevelService.deleteDegreelevel(id, profileId);

    return new ResponseRequest(res, true, degreeLevelMsg.delete);
  }

  @Get()
  public async getAllDegreeLevel(
    @Query() queryDto: QueryDegreeLevelDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.degreeLevelService.findAllDegreeLevels(queryDto);

    return new ResponseRequest(res, result, degreeLevelMsg.getAll);
  }

  @Get('/:id')
  public async getDegreeLevelById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.degreeLevelService.findDegreeLevelById(id);

    return new ResponseRequest(res, result, degreeLevelMsg.getById);
  }
}
