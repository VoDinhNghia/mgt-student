import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseRequest } from 'src/utils/utils.response-api';
import { ErolesUser } from 'src/constants/constant';
import { JwtAuthGuard } from '../auth/guards/auth.jwt-auth.guard';
import { RoleGuard } from '../auth/guards/auth.role-auth.guard';
import { CreateSemesterDto } from './dtos/semesters.create.dto';
import { SemestersService } from './semesters.service';
import { Response, Request } from 'express';
import { UpdateSemesterDto } from './dtos/semesters.update.dto';
import { semesterMsg } from 'src/constants/constants.message.response';
import { UserLoginResponseDto } from '../auth/dtos/auth.result.login-service.dto';
import { semesterController } from 'src/constants/constants.controller.name-tag';
import { QuerySemesterDto } from './dtos/semesters.query.dto';

@Controller(semesterController.name)
@ApiTags(semesterController.tag)
export class SemestersController {
  constructor(private readonly semesterService: SemestersService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async createSemester(
    @Body() semesterDto: CreateSemesterDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const result = await this.semesterService.createSemester(
      semesterDto,
      profileId,
    );

    return new ResponseRequest(res, result, semesterMsg.create);
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async updateSemester(
    @Param('id') id: string,
    @Body() updateDto: UpdateSemesterDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const result = await this.semesterService.updateSemester(
      id,
      updateDto,
      profileId,
    );

    return new ResponseRequest(res, result, semesterMsg.update);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async deleteSemester(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    await this.semesterService.deleteSemester(id, profileId);

    return new ResponseRequest(res, true, semesterMsg.delete);
  }

  @Get()
  public async getAllSemester(
    @Query() queryDto: QuerySemesterDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const results = await this.semesterService.findAllSemesters(queryDto);

    return new ResponseRequest(res, results, semesterMsg.getAll);
  }

  @Get('/:id')
  public async getSemesterById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.semesterService.findSemesterById(id);

    return new ResponseRequest(res, result, semesterMsg.getById);
  }
}
