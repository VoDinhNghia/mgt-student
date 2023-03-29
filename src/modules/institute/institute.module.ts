import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Attachment,
  AttachmentlSchema,
} from '../attachments/schemas/attachments.schema';
import { Rooms, RoomSchema } from '../rooms/schemas/rooms.schema';
import { Profile, ProfileSchema } from '../users/schemas/users.profile.schema';
import { InstituteController } from './institute.controller';
import { InstituteService } from './institute.service';
import { Institudes, InstitudeSchema } from './schemas/institute.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Institudes.name, schema: InstitudeSchema },
      { name: Profile.name, schema: ProfileSchema },
      { name: Attachment.name, schema: AttachmentlSchema },
      { name: Rooms.name, schema: RoomSchema },
    ]),
  ],
  providers: [InstituteService],
  controllers: [InstituteController],
})
export class InstituteModule {}
