import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ErolesUser } from 'src/constants/constant';
import { ResponseRequest } from 'src/utils/utils.response-api';
import { JwtAuthGuard } from '../auth/guards/auth.jwt-auth.guard';
import { RoleGuard } from '../auth/guards/auth.role-auth.guard';
import { CenterService } from './centers.service';
import { Response, Request } from 'express';
import { CreateCenterDto } from './dtos/centers.create.dto';
import { UpdateCenterDto } from './dtos/centers.update.dto';
import { centerMsg } from 'src/constants/constants.message.response';
import { UserLoginResponseDto } from '../auth/dtos/auth.result.login-service.dto';
import { centerController } from 'src/constants/constants.controller.name-tag';
import { QueryCenterDto } from './dtos/centers.query.dto';

@Controller(centerController.name)
@ApiTags(centerController.tag)
export class CenterController {
  constructor(private readonly service: CenterService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async createCenter(
    @Body() centerDto: CreateCenterDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const result = await this.service.createCenter(centerDto, profileId);

    return new ResponseRequest(res, result, centerMsg.create);
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async updateCenter(
    @Param('id') id: string,
    @Body() centerDto: UpdateCenterDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req.user;
    const { profileId } = user;
    const result = await this.service.updateCenter(id, centerDto, profileId);

    return new ResponseRequest(res, result, centerMsg.update);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async deleteCenter(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req.user;
    const { profileId } = user;
    await this.service.deleteCenter(id, profileId);

    return new ResponseRequest(res, true, centerMsg.delete);
  }

  @Get()
  public async getAllCenter(
    @Query() queryDto: QueryCenterDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.service.findAllCenter(queryDto);

    return new ResponseRequest(res, result, centerMsg.getAll);
  }

  @Get('/:id')
  public async getCenterById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.service.findCenterById(id);

    return new ResponseRequest(res, result, centerMsg.getById);
  }
}
