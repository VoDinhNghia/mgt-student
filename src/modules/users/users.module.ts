import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from './schemas/users.schema';
import { UsersController } from './users.controller';
import { Profile, ProfileSchema } from './schemas/users.profile.schema';
import {
  Leader_Schools,
  LeaderSchoolSchema,
} from './schemas/users.leader-school.schema';
import {
  Study_Processes,
  StudyProcessSchema,
} from './schemas/users.study-process.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Users.name, schema: UsersSchema },
      { name: Profile.name, schema: ProfileSchema },
      { name: Leader_Schools.name, schema: LeaderSchoolSchema },
      { name: Study_Processes.name, schema: StudyProcessSchema },
    ]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
