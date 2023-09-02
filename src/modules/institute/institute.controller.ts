import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Res,
  Req,
  Query,
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
import { instituteMsg } from 'src/constants/constants.message.response';
import { UserLoginResponseDto } from '../auth/dtos/auth.result.login-service.dto';
import { instituteController } from 'src/constants/constants.controller.name-tag';
import { QueryIntituteDto } from './dtos/institute.query.dto';

@Controller(instituteController.name)
@ApiTags(instituteController.tag)
export class InstituteController {
  constructor(private readonly instutiteService: InstituteService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async createInstitute(
    @Body() instituteDto: CreateInstituteDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const result = await this.instutiteService.createInstitute(
      instituteDto,
      profileId,
    );

    return new ResponseRequest(res, result, instituteMsg.create);
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async updateInstitute(
    @Param('id') id: string,
    @Body() instituteDto: UpdateInstituteDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const result = await this.instutiteService.updateInstitute(
      id,
      instituteDto,
      profileId,
    );

    return new ResponseRequest(res, result, instituteMsg.update);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async deleteInstitute(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    await this.instutiteService.deleteInstitude(id, profileId);

    return new ResponseRequest(res, true, instituteMsg.delete);
  }

  @Get()
  public async getAllInstitute(
    @Query() queryDto: QueryIntituteDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.instutiteService.findAllInstitudes(queryDto);

    return new ResponseRequest(res, result, instituteMsg.getAll);
  }

  @Get('/:id')
  public async getInstituteById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.instutiteService.findInstituteById(id);

    return new ResponseRequest(res, result, instituteMsg.getById);
  }
}
