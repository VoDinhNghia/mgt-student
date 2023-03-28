import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { ResponseRequest } from 'src/utils/utils.response-api';
import { SyncServiceService } from './sync-service.service';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ErolesUser, keyAccessLibraryService } from 'src/constants/constant';
import { AuthServiceAccessByKey } from 'src/validates/validates.service.key-access';
import { RoleGuard } from '../auth/guards/auth.role-auth.guard';
import { JwtAuthGuard } from '../auth/guards/auth.jwt-auth.guard';
import { syncServiceMsg } from 'src/constants/constants.message.response';
import { syncServiceController } from 'src/constants/constants.controller.name-tag';

@Controller(syncServiceController.name)
@ApiTags(syncServiceController.tag)
export class SyncServiceController {
  constructor(private readonly service: SyncServiceService) {}

  @Post('/migrate/user-library')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN]))
  async migrateUsers(@Res() res: Response): Promise<ResponseRequest> {
    const result = await this.service.migrateUser();
    return new ResponseRequest(res, result, syncServiceMsg.migrateUsersLibrary);
  }

  @Get('/users')
  @UseGuards(AuthServiceAccessByKey(keyAccessLibraryService))
  async getAllUsers(@Res() res: Response): Promise<ResponseRequest> {
    const result = await this.service.getUserForSyncData();
    return new ResponseRequest(
      res,
      result,
      syncServiceMsg.getAllUserSyncLibrary,
    );
  }
}
