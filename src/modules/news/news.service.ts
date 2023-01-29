import { HttpException, Injectable } from '@nestjs/common';
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
    let news = {};
    try {
      news = await new this.newsSchema(createNewDto).save();
    } catch (error) {
      throw new HttpException(
        { statusCode: 500, message: 'Server interval.' },
        500,
      );
    }
    return news;
  }

  async findNewById(id: string) {
    const result = await this.newsSchema.findById(id);
    if (!result) {
      throw new HttpException(
        { statusCode: 404, message: 'News not found!' },
        404,
      );
    }
    return result;
  }

  async getLists(query: QueryNewDto) {
    try {
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
    } catch (error) {
      throw new HttpException(
        { statusCode: 500, message: 'Server interval.' },
        500,
      );
    }
  }

  async updateNew(id: string, updateDto: UpdateNewDto) {
    try {
      await this.newsSchema.findByIdAndUpdate(id, updateDto);
    } catch (error) {
      throw new HttpException(
        { statusCode: 500, message: 'System error' },
        500,
      );
    }
    const getNew = await this.findNewById(id);
    return getNew;
  }
}
