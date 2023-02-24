import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Semester, SemesterSchema } from './schemas/semesters.schema';
import { SemestersController } from './semesters.controller';
import { SemestersService } from './semesters.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Semester.name, schema: SemesterSchema },
    ]),
  ],
  providers: [SemestersService],
  controllers: [SemestersController],
})
export class SemestersModule {}
