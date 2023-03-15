import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { ResponseRequest } from 'src/utils/response-api';
import { SyncServiceService } from './sync-service.service';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { keyAccessLibraryService } from 'src/constants/constant';
import { AuthServiceAccessByKey } from 'src/validates/validate.service.key-access';

@Controller('api/sync-service')
@ApiTags('sync-service')
export class SyncServiceController {
  constructor(private readonly service: SyncServiceService) {}

  @Get('/users')
  @UseGuards(AuthServiceAccessByKey(keyAccessLibraryService))
  async getAllUsers(@Res() res: Response): Promise<ResponseRequest> {
    const result = await this.service.getAllUsers();
    return new ResponseRequest(res, result, 'Get all users success');
  }
}
