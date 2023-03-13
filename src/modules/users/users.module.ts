import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from './schemas/users.schema';
import { UsersController } from './users.controller';
import { Profile, ProfileSchema } from './schemas/users.profile.schema';
import {
  LeaderSchool,
  LeaderSchoolSchema,
} from './schemas/users.leader-school.schema';
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
      { name: StudyProcess.name, schema: StudyProcessSchema },
    ]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
