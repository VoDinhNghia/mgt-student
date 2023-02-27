import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ValidateField } from 'src/abstracts/validateFieldById';
import { Course, CourseSchema } from '../courses/schemas/courses.schema';
import {
  DegreeLevel,
  DegreeLevelSchema,
} from '../degreelevel/schemas/degreelevel.schema';
import { Majors, MajorSchema } from '../faculties/schemas/major.schema';
import { Profile, ProfileSchema } from '../users/schemas/users.profile.schema';
import { Users, UsersSchema } from '../users/schemas/users.schema';
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
      { name: Users.name, schema: UsersSchema },
      { name: Majors.name, schema: MajorSchema },
      { name: Course.name, schema: CourseSchema },
      { name: DegreeLevel.name, schema: DegreeLevelSchema },
      { name: Profile.name, schema: ProfileSchema },
    ]),
  ],
  providers: [ClassSubjectService, ValidateField],
  controllers: [ClassSubjectController],
})
export class ClassSubjectModule {}
