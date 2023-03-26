import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
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
import { msgResponse } from 'src/constants/message.response';
import { UserLoginResponseDto } from '../auth/dtos/auth.result.login-service.dto';

@Controller('api/centers')
@ApiTags('centers')
export class CenterController {
  constructor(private readonly service: CenterService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async createCenter(
    @Body() centerDto: CreateCenterDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const createdBy: string = user.profileId;
    const result = await this.service.createCenter(centerDto, createdBy);
    return new ResponseRequest(res, result, msgResponse.createCenter);
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async updateCenter(
    @Param('id') id: string,
    @Body() centerDto: UpdateCenterDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const updatedBy: string = user.profileId;
    const result = await this.service.updateCenter(id, centerDto, updatedBy);
    return new ResponseRequest(res, result, msgResponse.updateCenter);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async deleteCenter(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const deletedBy: string = user.profileId;
    await this.service.deleteCenter(id, deletedBy);
    return new ResponseRequest(res, true, msgResponse.deleteCenter);
  }

  @Get()
  async getAllCenter(@Res() res: Response): Promise<ResponseRequest> {
    const result = await this.service.findAllCenter();
    return new ResponseRequest(res, result, msgResponse.getAllCenter);
  }

  @Get('/:id')
  async getCenterById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.service.findCenterById(id);
    return new ResponseRequest(res, result, msgResponse.getByIdCenter);
  }
}
