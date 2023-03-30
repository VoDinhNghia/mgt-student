import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from '../courses/schemas/courses.schema';
import {
  DegreeLevel,
  DegreeLevelSchema,
} from '../degreelevels/schemas/degreelevels.schema';
import {
  Majors,
  MajorSchema,
} from '../faculties/schemas/faculties.major.schema';
import {
  Semester,
  SemesterSchema,
} from '../semesters/schemas/semesters.schema';
import { Profile, ProfileSchema } from '../users/schemas/users.profile.schema';
import { ClassSubjectController } from './class-subject.controller';
import { ClassSubjectService } from './class-subject.service';
import {
  ClassInfos,
  ClassInfoSchema,
} from './schemas/class-subject.class.schema';
import {
  Subjects,
  SubjectSchema,
} from './schemas/class-subject.subject.schema';
import {
  SubjectProcess,
  SubjectProcessSchema,
} from './schemas/class-subject.subjectProcess';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ClassInfos.name, schema: ClassInfoSchema },
      { name: Subjects.name, schema: SubjectSchema },
      { name: SubjectProcess.name, schema: SubjectProcessSchema },
      { name: Course.name, schema: CourseSchema },
      { name: DegreeLevel.name, schema: DegreeLevelSchema },
      { name: Semester.name, schema: SemesterSchema },
      { name: Profile.name, schema: ProfileSchema },
      { name: Majors.name, schema: MajorSchema },
    ]),
  ],
  providers: [ClassSubjectService],
  controllers: [ClassSubjectController],
})
export class ClassSubjectModule {}
