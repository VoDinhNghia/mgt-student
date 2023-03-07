import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ErolesUser } from 'src/constants/constant';
import { ResponseRequest } from 'src/utils/response-api';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role-auth.guard';
import { CenterService } from './center.service';
import { Response } from 'express';
import { CreateCenterDto } from './dtos/center.create.dto';
import { UpdateCenterDto } from './dtos/center.update.dto';

@Controller('api/centers')
@ApiTags('centers')
export class CenterController {
  constructor(private readonly service: CenterService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.ADMIN]))
  async createCenter(
    @Body() centerDto: CreateCenterDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.service.createCenter(centerDto);
    return new ResponseRequest(res, result, 'Create center success.');
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.ADMIN]))
  async updateCenter(
    @Param('id') id: string,
    @Body() centerDto: UpdateCenterDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.service.updateCenter(id, centerDto);
    return new ResponseRequest(res, result, 'Update center success.');
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.ADMIN]))
  async deleteCenter(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    await this.service.deleteCenter(id);
    return new ResponseRequest(res, true, 'Delete center success.');
  }

  @Get()
  async getAllCenter(@Res() res: Response): Promise<ResponseRequest> {
    const result = await this.service.findAllCenter();
    return new ResponseRequest(res, result, 'Get center success.');
  }

  @Get('/:id')
  async getCenterById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.service.findCenterById(id);
    return new ResponseRequest(res, result, 'Get center success.');
  }
}
