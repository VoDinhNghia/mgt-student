import { Module } from '@nestjs/common';
import { CenterService } from './center.service';
import { CenterController } from './center.controller';

@Module({
  providers: [CenterService],
  controllers: [CenterController],
})
export class CenterModule {}
