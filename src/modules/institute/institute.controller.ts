import {
  Body,
  Controller,
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
import { InstituteService } from './institute.service';
import { Response, Request } from 'express';
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
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async createInstitute(
    @Body() instituteDto: CreateInstituteDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const { user }: Request | Record<string, any> = req;
    const createdBy: string = user.profileId;
    const result = await this.instutiteService.createInstitute(
      instituteDto,
      createdBy,
    );
    return new ResponseRequest(res, result, 'Create institute success');
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async updateInstitute(
    @Param('id') id: string,
    @Body() instituteDto: UpdateInstituteDto,
    @Res() res: ResponseRequest,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const { user }: Request | Record<string, any> = req;
    const updatedBy: string = user.profileId;
    const result = await this.instutiteService.updateInstitute(
      id,
      instituteDto,
      updatedBy,
    );
    return new ResponseRequest(res, result, 'Update institute success.');
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async deleteInstitute(
    @Param('id') id: string,
    @Res() res: ResponseRequest,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const { user }: Request | Record<string, any> = req;
    const deletedBy: string = user.profileId;
    await this.instutiteService.deleteInstitude(id, deletedBy);
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
