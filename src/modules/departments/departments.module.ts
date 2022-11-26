import { Module } from '@nestjs/common';
import { DepartmentsService } from './departments.service';

@Module({
  providers: [DepartmentsService]
})
export class DepartmentsModule {}
