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
import { ResponseRequest } from 'src/utils/response-api';
import { ErolesUser } from 'src/constants/constant';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role-auth.guard';
import { DegreelevelService } from './degreelevels.service';
import { CreateDegreeLevelDto } from './dtos/degreelevels.create.dto';
import { Response, Request } from 'express';
import { UpdateDegreeLevelDto } from './dtos/degreeLevels.update.dto';

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
    const { user }: Request | Record<string, any> = req;
    const createdBy: string = user.profileId;
    const result = await this.degreeLevelService.createDegreeLevel(
      degreeLevelDto,
      createdBy,
    );
    return new ResponseRequest(res, result, 'Create degreeLevel success.');
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
    const { user }: Request | Record<string, any> = req;
    const updatedBy: string = user.profileId;
    const result = await this.degreeLevelService.updateDegreeLevel(
      id,
      degreeLevelDto,
      updatedBy,
    );
    return new ResponseRequest(res, result, 'Create degreeLevel success.');
  }

  @Get()
  async getAllDegreeLevel(@Res() res: Response): Promise<ResponseRequest> {
    const result = await this.degreeLevelService.findAllDegreeLevels();
    return new ResponseRequest(res, result, 'Get all degreeLevel success.');
  }

  @Get('/:id')
  async getDegreeLevelById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.degreeLevelService.findDegreeLevelById(id);
    return new ResponseRequest(res, result, 'Get all degreeLevel success.');
  }
}
