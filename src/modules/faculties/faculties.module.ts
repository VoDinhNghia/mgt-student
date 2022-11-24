import { Module } from '@nestjs/common';
import { FacultiesController } from './faculties.controller';
import { FacultiesService } from './faculties.service';

@Module({
  controllers: [FacultiesController],
  providers: [FacultiesService],
})
export class FacultiesModule {}
