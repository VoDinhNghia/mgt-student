import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Attachment,
  AttachmentlSchema,
} from '../attachments/schemas/attachments.schema';
import { Profile, ProfileSchema } from '../users/schemas/users.profile.schema';
import { UnionImages, UnionImageSchema } from './schemas/unions.images.schema';
import {
  UnionMembers,
  UnionMemberSchema,
} from './schemas/unions.members.schema';
import { Union, UnionSchema } from './schemas/unions.schema';
import { UnionsController } from './unions.controller';
import { UnionsService } from './unions.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Union.name,
        schema: UnionSchema,
      },
      {
        name: UnionMembers.name,
        schema: UnionMemberSchema,
      },
      {
        name: UnionImages.name,
        schema: UnionImageSchema,
      },
      {
        name: Profile.name,
        schema: ProfileSchema,
      },
      {
        name: Attachment.name,
        schema: AttachmentlSchema,
      },
    ]),
  ],
  providers: [UnionsService],
  controllers: [UnionsController],
})
export class UnionsModule {}
