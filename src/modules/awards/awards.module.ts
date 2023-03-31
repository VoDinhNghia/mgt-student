import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Attachment,
  AttachmentlSchema,
} from '../attachments/schemas/attachments.schema';
import { AwardsController } from './awards.controller';
import { AwardsService } from './awards.service';
import { Award, AwardSchema } from './schemas/awards.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Award.name, schema: AwardSchema },
      { name: Attachment.name, schema: AttachmentlSchema },
    ]),
  ],
  controllers: [AwardsController],
  providers: [AwardsService],
})
export class AwardsModule {}
