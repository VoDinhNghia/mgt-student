import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNewDto } from './dtos/news.create.dto';
import { QueryNewDto } from './dtos/news.query.dto';
import { UpdateNewDto } from './dtos/news.update.dto';
import { News, NewsDocument } from './schemas/news.schema';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name)
    private readonly newsSchema: Model<NewsDocument>,
  ) {}

  async createNew(createNewDto: CreateNewDto) {
    const news = await new this.newsSchema(createNewDto).save();
    return news;
  }

  async findNewById(id: string) {
    const result = await this.newsSchema.findById(id);
    return result;
  }

  async getLists(query: QueryNewDto) {
    const { limit, page, type } = query;
    let aggregate: any[] = [];
    const match: Record<string, any> = { $match: {} };
    if (type) {
      match.$match.type = type;
    }
    aggregate = [...aggregate, match];
    if (limit && page) {
      aggregate = [
        ...aggregate,
        {
          $skip: Number(limit) * Number(page) - Number(limit),
        },
        { $limit: Number(limit) },
      ];
    }
    const results = await this.newsSchema.aggregate(aggregate);
    return results;
  }

  async updateNew(id: string, updateDto: UpdateNewDto) {
    await this.newsSchema.findByIdAndUpdate(id, updateDto);
    const getNew = await this.newsSchema.findById(id);
    return getNew;
  }
}
