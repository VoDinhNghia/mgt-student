import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from './schemas/users.schema';
import { UsersController } from './users.controller';
import { Profile, ProfileSchema } from './schemas/users.profile.schema';
import { ValidateField } from 'src/abstracts/validateFieldById';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Users.name, schema: UsersSchema },
      { name: Profile.name, schema: ProfileSchema },
    ]),
  ],
  providers: [UsersService, ValidateField],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
