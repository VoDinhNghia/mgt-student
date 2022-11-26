import { Module } from '@nestjs/common';
import { SemestersService } from './semesters.service';

@Module({
  providers: [SemestersService]
})
export class SemestersModule {}
