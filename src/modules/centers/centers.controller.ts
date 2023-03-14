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
import { ResponseRequest } from 'src/utils/response-api';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role-auth.guard';
import { CenterService } from './centers.service';
import { Response, Request } from 'express';
import { CreateCenterDto } from './dtos/centers.create.dto';
import { UpdateCenterDto } from './dtos/centers.update.dto';

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
    const { user }: Request | Record<string, any> = req;
    const createdBy: string = user.profileId;
    const result = await this.service.createCenter(centerDto, createdBy);
    return new ResponseRequest(res, result, 'Create center success.');
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
    const { user }: Request | Record<string, any> = req;
    const updatedBy: string = user.profileId;
    const result = await this.service.updateCenter(id, centerDto, updatedBy);
    return new ResponseRequest(res, result, 'Update center success.');
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
    const { user }: Request | Record<string, any> = req;
    const deletedBy: string = user.profileId;
    await this.service.deleteCenter(id, deletedBy);
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
