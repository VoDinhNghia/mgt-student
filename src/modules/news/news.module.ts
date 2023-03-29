import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Attachment,
  AttachmentlSchema,
} from '../attachments/schemas/attachments.schema';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { News, NewsSchema } from './schemas/news.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: News.name, schema: NewsSchema },
      { name: Attachment.name, schema: AttachmentlSchema },
    ]),
  ],
  providers: [NewsService],
  controllers: [NewsController],
  exports: [NewsService],
})
export class NewsModule {}
