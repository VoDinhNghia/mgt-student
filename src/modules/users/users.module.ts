import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from './schemas/users.schema';
import { UsersController } from './users.controller';
import { Profile, ProfileSchema } from './schemas/users.profile.schema';
import { ValidateField } from 'src/validates/validateFieldById';
import {
  LeaderSchool,
  LeaderSchoolSchema,
} from './schemas/users.leader-school.schema';
import { Course, CourseSchema } from '../courses/schemas/courses.schema';
import { Faculty, FacultySchema } from '../faculties/schemas/faculties.schema';
import {
  ClassInfos,
  ClassInfoSchema,
} from '../class-subject/schemas/class-subject.class.schema';
import { Award, AwardSchema } from '../awards/schemas/awards.schema';
import {
  DegreeLevel,
  DegreeLevelSchema,
} from '../degreelevel/schemas/degreelevel.schema';
import { Majors, MajorSchema } from '../faculties/schemas/major.schema';
import {
  StudyProcess,
  StudyProcessSchema,
} from './schemas/study-process.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Users.name, schema: UsersSchema },
      { name: Profile.name, schema: ProfileSchema },
      { name: LeaderSchool.name, schema: LeaderSchoolSchema },
      { name: Course.name, schema: CourseSchema },
      { name: Faculty.name, schema: FacultySchema },
      { name: ClassInfos.name, schema: ClassInfoSchema },
      { name: Award.name, schema: AwardSchema },
      { name: DegreeLevel.name, schema: DegreeLevelSchema },
      { name: Majors.name, schema: MajorSchema },
      { name: StudyProcess.name, schema: StudyProcessSchema },
    ]),
  ],
  providers: [UsersService, ValidateField],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
