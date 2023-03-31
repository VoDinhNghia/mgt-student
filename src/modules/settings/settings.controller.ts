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
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { settingController } from 'src/constants/constants.controller.name-tag';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/guards/auth.jwt-auth.guard';
import { RoleGuard } from '../auth/guards/auth.role-auth.guard';
import { ErolesUser } from 'src/constants/constant';
import { CreateSettingSubjectPassDto } from './dtos/settings.create.subject-pass.dto';
import { Response, Request } from 'express';
import { ResponseRequest } from 'src/utils/utils.response-api';
import { UserLoginResponseDto } from '../auth/dtos/auth.result.login-service.dto';
import { settingMsg } from 'src/constants/constants.message.response';
import { CreateSettingLearningRateDto } from './dtos/settings.create.learning-rate.dto';
import { UpdateSettingSubjectPassDto } from './dtos/settings.update.subject-pass.dto';
import { UpdateSettingLearningRateDto } from './dtos/settings.update.learning-rate.dto';
import { QuerySettingSubjectPassDto } from './dtos/settings.query-subject-pass.dto';
import { QuerySettingLearningRateDto } from './dtos/settings.query-learning-rate.dto';

@Controller(settingController.name)
@ApiTags(settingController.tag)
export class SettingsController {
  constructor(private readonly service: SettingsService) {}

  @Post('/subject-pass')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async createSubjectPass(
    @Body() createDto: CreateSettingSubjectPassDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const createdBy: string = user?.profileId;
    const result = await this.service.createSettingSubjectPass(
      createDto,
      createdBy,
    );
    return new ResponseRequest(res, result, settingMsg.createSubjectPass);
  }

  @Post('/learning-rate')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async createLearningRate(
    @Body() createDto: CreateSettingLearningRateDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const createdBy: string = user?.profileId;
    const result = await this.service.createSettingLearningRate(
      createDto,
      createdBy,
    );
    return new ResponseRequest(res, result, settingMsg.createLearningrate);
  }

  @Put('/subject-pass/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async updateSubjectPass(
    @Param('id') id: string,
    @Body() updateDto: UpdateSettingSubjectPassDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const updatedBy: string = user?.profileId;
    const result = await this.service.updateSettingSubjectPass(
      id,
      updateDto,
      updatedBy,
    );
    return new ResponseRequest(res, result, settingMsg.updateSubjectPass);
  }

  @Put('/learning-rate/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async updateLearningRate(
    @Param('id') id: string,
    @Body() updateDto: UpdateSettingLearningRateDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const updatedBy: string = user?.profileId;
    const result = await this.service.updateSettingLearningRate(
      id,
      updateDto,
      updatedBy,
    );
    return new ResponseRequest(res, result, settingMsg.updateLearningRate);
  }

  @Delete('/subject-pass/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async deleteSubjectPass(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const deletedBy: string = user?.profileId;
    await this.service.deleteSettingSubjectPass(id, deletedBy);
    return new ResponseRequest(res, true, settingMsg.deleteSubjectPass);
  }

  @Delete('/learning-rate/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async deleteLearningRate(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const deletedBy: string = user?.profileId;
    await this.service.deleteSettingLearningRate(id, deletedBy);
    return new ResponseRequest(res, true, settingMsg.deleteLearningRate);
  }

  @Get('/subject-pass')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async getAllSubjectPass(
    @Query() queryDto: QuerySettingSubjectPassDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const results = await this.service.findAllSettingSubjectPass(queryDto);
    return new ResponseRequest(res, results, settingMsg.getAllSubjectPass);
  }

  @Get('/learning-rate')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async getAllLearningRate(
    @Query() queryDto: QuerySettingLearningRateDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const results = await this.service.findAllSettingLearningRate(queryDto);
    return new ResponseRequest(res, results, settingMsg.getAllLearningRate);
  }

  @Get('/subject-pass/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async getSubjectPassById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.service.findSettingSubjectPassById(id);
    return new ResponseRequest(res, result, settingMsg.getByIdSubjectPass);
  }

  @Get('/learning-rate/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async getLearningRateById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.service.findSettingLearningRateById(id);
    return new ResponseRequest(res, result, settingMsg.getByIdLearningRate);
  }
}
