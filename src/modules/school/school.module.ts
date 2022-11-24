import { Module } from '@nestjs/common';
import { SchoolController } from './school.controller';

@Module({
  controllers: [SchoolController]
})
export class SchoolModule {}
