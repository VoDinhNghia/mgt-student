import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
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
import { msgResponse } from 'src/constants/message.response';
import { UserLoginResponseDto } from '../auth/dtos/auth.result.login-service.dto';

@Controller('api/degreelevels')
@ApiTags('degreelevels')
export class DegreelevelController {
  constructor(private readonly degreeLevelService: DegreelevelService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async createDegreeLevel(
    @Body() degreeLevelDto: CreateDegreeLevelDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const createdBy: string = user.profileId;
    const result = await this.degreeLevelService.createDegreeLevel(
      degreeLevelDto,
      createdBy,
    );
    return new ResponseRequest(res, result, msgResponse.createDegreelevel);
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async updateDegreeLevel(
    @Param('id') id: string,
    @Body() degreeLevelDto: UpdateDegreeLevelDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const updatedBy: string = user.profileId;
    const result = await this.degreeLevelService.updateDegreeLevel(
      id,
      degreeLevelDto,
      updatedBy,
    );
    return new ResponseRequest(res, result, msgResponse.updateDegreelevel);
  }

  @Get()
  async getAllDegreeLevel(@Res() res: Response): Promise<ResponseRequest> {
    const result = await this.degreeLevelService.findAllDegreeLevels();
    return new ResponseRequest(res, result, msgResponse.getAllDegreelevel);
  }

  @Get('/:id')
  async getDegreeLevelById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.degreeLevelService.findDegreeLevelById(id);
    return new ResponseRequest(res, result, msgResponse.getByIdDegreelevel);
  }
}
