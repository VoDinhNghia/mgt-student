import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClassSubjectController } from './class-subject.controller';
import { ClassSubjectService } from './class-subject.service';
import {
  Class_Infos,
  ClassInfoSchema,
} from './schemas/class-subject.class.schema';
import {
  Subjects,
  SubjectSchema,
} from './schemas/class-subject.subject.schema';
import {
  Subject_Process,
  SubjectProcessSchema,
} from './schemas/class-subject.subjectProcess';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Class_Infos.name, schema: ClassInfoSchema },
      { name: Subjects.name, schema: SubjectSchema },
      { name: Subject_Process.name, schema: SubjectProcessSchema },
    ]),
  ],
  providers: [ClassSubjectService],
  controllers: [ClassSubjectController],
})
export class ClassSubjectModule {}
