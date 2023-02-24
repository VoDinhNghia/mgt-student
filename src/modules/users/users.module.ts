import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from './schemas/users.schema';
import { UsersController } from './users.controller';
import { Profile, ProfileSchema } from './schemas/users.profile.schema';
import { ValidateField } from 'src/abstracts/validateFieldById';
import {
  LeaderSchool,
  LeaderSchoolSchema,
} from './schemas/users.leader-school.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Users.name, schema: UsersSchema },
      { name: Profile.name, schema: ProfileSchema },
      { name: LeaderSchool.name, schema: LeaderSchoolSchema },
    ]),
  ],
  providers: [UsersService, ValidateField],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
