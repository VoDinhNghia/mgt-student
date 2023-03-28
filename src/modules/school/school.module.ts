import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Attachment,
  AttachmentlSchema,
} from '../attachments/schemas/attachments.schema';
import { Award, AwardSchema } from '../awards/schemas/awards.schema';
import { SchoolInfo, SchoolSchema } from './schemas/school.schema';
import { SchoolController } from './school.controller';
import { SchoolService } from './school.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SchoolInfo.name, schema: SchoolSchema },
      { name: Attachment.name, schema: AttachmentlSchema },
      { name: Award.name, schema: AwardSchema },
    ]),
  ],
  controllers: [SchoolController],
  providers: [SchoolService],
})
export class SchoolModule {}
