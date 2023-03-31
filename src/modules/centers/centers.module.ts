import { Module } from '@nestjs/common';
import { CenterService } from './centers.service';
import { CenterController } from './centers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Center, CenterSchema } from './schemas/centers.schema';
import { Profile, ProfileSchema } from '../users/schemas/users.profile.schema';
import { Award, AwardSchema } from '../awards/schemas/awards.schema';
import { Rooms, RoomSchema } from '../rooms/schemas/rooms.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Center.name, schema: CenterSchema },
      { name: Profile.name, schema: ProfileSchema },
      { name: Award.name, schema: AwardSchema },
      { name: Rooms.name, schema: RoomSchema },
    ]),
  ],
  providers: [CenterService],
  controllers: [CenterController],
})
export class CenterModule {}
