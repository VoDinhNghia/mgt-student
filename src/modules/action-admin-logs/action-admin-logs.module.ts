import { Module } from '@nestjs/common';
import { ActionAdminLogsService } from './action-admin-logs.service';

@Module({
  providers: [ActionAdminLogsService],
})
export class ActionAdminLogsModule {}
