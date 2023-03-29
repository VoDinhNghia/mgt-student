import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from './schemas/users.schema';
import { UsersController } from './users.controller';
import { Profile, ProfileSchema } from './schemas/users.profile.schema';
import {
  LeaderSchools,
  LeaderSchoolSchema,
} from './schemas/users.leader-school.schema';
import {
  StudyProcesses,
  StudyProcessSchema,
} from './schemas/users.study-process.schema';
import { Award, AwardSchema } from '../awards/schemas/awards.schema';
import { Faculty, FacultySchema } from '../faculties/schemas/faculties.schema';
import {
  DegreeLevel,
  DegreeLevelSchema,
} from '../degreelevels/schemas/degreelevels.schema';
import {
  Majors,
  MajorSchema,
} from '../faculties/schemas/faculties.major.schema';
import {
  ClassInfos,
  ClassInfoSchema,
} from '../class-subject/schemas/class-subject.class.schema';
import { Course, CourseSchema } from '../courses/schemas/courses.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Users.name, schema: UsersSchema },
      { name: Profile.name, schema: ProfileSchema },
      { name: LeaderSchools.name, schema: LeaderSchoolSchema },
      { name: StudyProcesses.name, schema: StudyProcessSchema },
      { name: Award.name, schema: AwardSchema },
      { name: Faculty.name, schema: FacultySchema },
      { name: DegreeLevel.name, schema: DegreeLevelSchema },
      { name: Majors.name, schema: MajorSchema },
      { name: ClassInfos.name, schema: ClassInfoSchema },
      { name: Course.name, schema: CourseSchema },
    ]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
