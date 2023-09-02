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
import { CreateSettingMoneyCreditDto } from './dtos/settings.create.money-credit.dto';
import { UpdateSettingMoneyCreditDto } from './dtos/settings.update.money-credit.dto';
import { QuerySettingMoneyCreditDto } from './dtos/settings.query.money-credit.dto';

@Controller(settingController.name)
@ApiTags(settingController.tag)
export class SettingsController {
  constructor(private readonly service: SettingsService) {}

  @Post('/subject-pass')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async createSubjectPass(
    @Body() createDto: CreateSettingSubjectPassDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const result = await this.service.createSettingSubjectPass(
      createDto,
      profileId,
    );

    return new ResponseRequest(res, result, settingMsg.createSubjectPass);
  }

  @Post('/learning-rate')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async createLearningRate(
    @Body() createDto: CreateSettingLearningRateDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const result = await this.service.createSettingLearningRate(
      createDto,
      profileId,
    );

    return new ResponseRequest(res, result, settingMsg.createLearningrate);
  }

  @Put('/subject-pass/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async updateSubjectPass(
    @Param('id') id: string,
    @Body() updateDto: UpdateSettingSubjectPassDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const result = await this.service.updateSettingSubjectPass(
      id,
      updateDto,
      profileId,
    );

    return new ResponseRequest(res, result, settingMsg.updateSubjectPass);
  }

  @Put('/learning-rate/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async updateLearningRate(
    @Param('id') id: string,
    @Body() updateDto: UpdateSettingLearningRateDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const result = await this.service.updateSettingLearningRate(
      id,
      updateDto,
      profileId,
    );

    return new ResponseRequest(res, result, settingMsg.updateLearningRate);
  }

  @Delete('/subject-pass/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async deleteSubjectPass(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    await this.service.deleteSettingSubjectPass(id, profileId);

    return new ResponseRequest(res, true, settingMsg.deleteSubjectPass);
  }

  @Delete('/learning-rate/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async deleteLearningRate(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    await this.service.deleteSettingLearningRate(id, profileId);

    return new ResponseRequest(res, true, settingMsg.deleteLearningRate);
  }

  @Get('/subject-pass')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async getAllSubjectPass(
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
  public async getAllLearningRate(
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
  public async getSubjectPassById(
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
  public async getLearningRateById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.service.findSettingLearningRateById(id);

    return new ResponseRequest(res, result, settingMsg.getByIdLearningRate);
  }

  @Post('/money-credit')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async createMoneyCredit(
    @Body() createDto: CreateSettingMoneyCreditDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const result = await this.service.createSettingMoneyCredit(
      createDto,
      profileId,
    );

    return new ResponseRequest(res, result, settingMsg.createMoneyCredit);
  }

  @Put('/money-credit/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async updateMoneyCredit(
    @Param('id') id: string,
    @Body() updateDto: UpdateSettingMoneyCreditDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const result = await this.service.updateSettingMoneyCredit(
      id,
      updateDto,
      profileId,
    );

    return new ResponseRequest(res, result, settingMsg.updateMoneyCredit);
  }

  @Get('/money-credit')
  public async getAllMoneyCredit(
    @Query() queryDto: QuerySettingMoneyCreditDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.service.findAllSettingMoneyCredit(queryDto);

    return new ResponseRequest(res, result, settingMsg.getAllMoneyCredit);
  }

  @Get('/money-credit/:id')
  public async getByIdMoneyCredit(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.service.findSettingMoneyCreditById(id);

    return new ResponseRequest(res, result, settingMsg.getByIdMoneyCredit);
  }
}
