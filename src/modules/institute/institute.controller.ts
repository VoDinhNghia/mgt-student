import {
  Body,
  Controller,
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
import { InstituteService } from './institute.service';
import { Response } from 'express';
import { CreateInstituteDto } from './dtos/institute.create.dto';
import { UpdateInstituteDto } from './dtos/institute.update.dto';
import { Delete } from '@nestjs/common/decorators/http/request-mapping.decorator';

@Controller('api/institutes')
@ApiTags('institutes')
export class InstituteController {
  constructor(private readonly instutiteService: InstituteService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.ADMIN]))
  async createInstitute(
    @Body() instituteDto: CreateInstituteDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.instutiteService.createInstitute(instituteDto);
    return new ResponseRequest(res, result, 'Create institute success');
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.ADMIN]))
  async updateInstitute(
    @Param('id') id: string,
    @Body() instituteDto: UpdateInstituteDto,
    @Res() res: ResponseRequest,
  ): Promise<ResponseRequest> {
    const result = await this.instutiteService.updateInstitute(
      id,
      instituteDto,
    );
    return new ResponseRequest(res, result, 'Update institute success.');
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.ADMIN]))
  async deleteInstitute(
    @Param('id') id: string,
    @Res() res: ResponseRequest,
  ): Promise<ResponseRequest> {
    await this.instutiteService.deleteInstitude(id);
    return new ResponseRequest(res, true, 'Delete institute success.');
  }

  @Get()
  async getAllInstitute(@Res() res: ResponseRequest): Promise<ResponseRequest> {
    const result = await this.instutiteService.findAllInstitudes();
    return new ResponseRequest(res, result, 'Get all institute success');
  }

  @Get('/:id')
  async getInstituteById(
    @Param('id') id: string,
    @Res() res: ResponseRequest,
  ): Promise<ResponseRequest> {
    const result = await this.instutiteService.findInstituteById(id);
    return new ResponseRequest(res, result, 'Get institute by id success.');
  }
}
