import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { News, NewsSchema } from './schemas/news.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: News.name, schema: NewsSchema }]),
  ],
  providers: [NewsService],
  controllers: [NewsController],
  exports: [NewsService],
})
export class NewsModule {}
