import { Module } from '@nestjs/common';
import { CenterService } from './center.service';
import { CenterController } from './center.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Center, CenterSchema } from './schemas/center.schema';
import { Rooms, RoomSchema } from '../rooms/schemas/rooms.schema';
import { Award, AwardSchema } from '../awards/schemas/awards.schema';
import { Profile, ProfileSchema } from '../users/schemas/users.profile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Center.name, schema: CenterSchema },
      { name: Rooms.name, schema: RoomSchema },
      { name: Award.name, schema: AwardSchema },
      { name: Profile.name, schema: ProfileSchema },
    ]),
  ],
  providers: [CenterService],
  controllers: [CenterController],
})
export class CenterModule {}
