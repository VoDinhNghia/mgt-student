import { Module } from '@nestjs/common';
import { ScholarshipController } from './scholarship.controller';
import { ScholarshipService } from './scholarship.service';

@Module({
  controllers: [ScholarshipController],
  providers: [ScholarshipService],
})
export class ScholarshipModule {}
