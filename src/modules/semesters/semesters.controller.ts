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
import { ResponseRequest } from 'src/utils/response-api';
import { ErolesUser } from 'src/constants/constant';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role-auth.guard';
import { CreateSemesterDto } from './dtos/semesters.create.dto';
import { SemestersService } from './semesters.service';
import { Response, Request } from 'express';
import { UpdateSemesterDto } from './dtos/semesters.update.dto';
import { msgResponse } from 'src/constants/message.response';
import { UserLoginResponseDto } from '../auth/dtos/auth.result.login-service.dto';

@Controller('api/semesters')
@ApiTags('semesters')
export class SemestersController {
  constructor(private readonly semesterService: SemestersService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async createSemester(
    @Body() semesterDto: CreateSemesterDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const createdBy: string = user.profileId;
    const result = await this.semesterService.createSemester(
      semesterDto,
      createdBy,
    );
    return new ResponseRequest(res, result, msgResponse.createSemester);
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async updateSemester(
    @Param('id') id: string,
    @Body() updateDto: UpdateSemesterDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const updatedBy: string = user.profileId;
    const result = await this.semesterService.updateSemester(
      id,
      updateDto,
      updatedBy,
    );
    return new ResponseRequest(res, result, msgResponse.updateSemester);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async deleteSemester(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const deletedBy: string = user.profileId;
    await this.semesterService.deleteSemester(id, deletedBy);
    return new ResponseRequest(res, true, msgResponse.deleteSemester);
  }

  @Get()
  async getAllSemester(@Res() res: Response): Promise<ResponseRequest> {
    const results = await this.semesterService.findAllSemesters();
    return new ResponseRequest(res, results, msgResponse.getAllSemester);
  }

  @Get('/:id')
  async getSemesterById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.semesterService.findSemesterById(id);
    return new ResponseRequest(res, result, msgResponse.getByIdSemester);
  }
}
