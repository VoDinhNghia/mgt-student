import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ErolesUser } from 'src/constants/constant';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role-auth.guard';
import { UnionsService } from './unions.service';
import { Response, Request } from 'express';
import { CreateUnionDto } from './dtos/unions.create.dto';
import { ResponseRequest } from 'src/utils/response-api';
import { UpdateUnionDto } from './dtos/unions.update.dto';

@Controller('api/unions')
@ApiTags('unions')
export class UnionsController {
  constructor(private readonly unionService: UnionsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async create(
    @Body() unionDto: CreateUnionDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const { user }: Request | Record<string, any> = req;
    const createdBy: string = user.profileId;
    const result = await this.unionService.createUnion(unionDto, createdBy);
    return new ResponseRequest(res, result, 'Create union success');
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async updateUnion(
    @Param('id') id: string,
    @Body() unionDto: UpdateUnionDto,
    @Res() res: ResponseRequest,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const { user }: Request | Record<string, any> = req;
    const updatedBy: string = user.profileId;
    const result = await this.unionService.updateUnion(id, unionDto, updatedBy);
    return new ResponseRequest(res, result, 'Update union success.');
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async deleteUnion(
    @Param('id') id: string,
    @Res() res: ResponseRequest,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const { user }: Request | Record<string, any> = req;
    const deletedBy: string = user.profileId;
    await this.unionService.deleteUnion(id, deletedBy);
    return new ResponseRequest(res, true, 'Delete union success.');
  }

  @Get()
  async getAllUnion(@Res() res: ResponseRequest): Promise<ResponseRequest> {
    const results = await this.unionService.findAllUnions();
    return new ResponseRequest(res, results, 'Get all union success');
  }

  @Get('/:id')
  async getUnionById(
    @Param('id') id: string,
    @Res() res: ResponseRequest,
  ): Promise<ResponseRequest> {
    const result = await this.unionService.findUnionById(id);
    return new ResponseRequest(res, result, 'Get union by id success.');
  }
}
