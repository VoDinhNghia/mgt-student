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
import { ResponseRequest } from 'src/utils/utils.response-api';
import { JwtAuthGuard } from '../auth/guards/auth.jwt-auth.guard';
import { RoleGuard } from '../auth/guards/auth.role-auth.guard';
import { InstituteService } from './institute.service';
import { Response, Request } from 'express';
import { CreateInstituteDto } from './dtos/institute.create.dto';
import { UpdateInstituteDto } from './dtos/institute.update.dto';
import { Delete } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { msgResponse } from 'src/constants/message.response';
import { UserLoginResponseDto } from '../auth/dtos/auth.result.login-service.dto';

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
    const user: UserLoginResponseDto = req?.user;
    const createdBy: string = user.profileId;
    const result = await this.instutiteService.createInstitute(
      instituteDto,
      createdBy,
    );
    return new ResponseRequest(res, result, msgResponse.createInstitute);
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
    const user: UserLoginResponseDto = req?.user;
    const updatedBy: string = user.profileId;
    const result = await this.instutiteService.updateInstitute(
      id,
      instituteDto,
      updatedBy,
    );
    return new ResponseRequest(res, result, msgResponse.updateInstitute);
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
    const user: UserLoginResponseDto = req?.user;
    const deletedBy: string = user.profileId;
    await this.instutiteService.deleteInstitude(id, deletedBy);
    return new ResponseRequest(res, true, msgResponse.deleteInstitute);
  }

  @Get()
  async getAllInstitute(@Res() res: ResponseRequest): Promise<ResponseRequest> {
    const result = await this.instutiteService.findAllInstitudes();
    return new ResponseRequest(res, result, msgResponse.getAllInstitute);
  }

  @Get('/:id')
  async getInstituteById(
    @Param('id') id: string,
    @Res() res: ResponseRequest,
  ): Promise<ResponseRequest> {
    const result = await this.instutiteService.findInstituteById(id);
    return new ResponseRequest(res, result, msgResponse.getByIdInstitute);
  }
}
