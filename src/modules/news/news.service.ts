import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonException } from 'src/exceptions/execeptionError';
import { Pagination } from 'src/utils/pagePagination';
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

  async createNews(createNewDto: CreateNewDto) {
    const news = await new this.newsSchema(createNewDto).save();

    return news;
  }

  async findNewById(id: string) {
    const result = await this.newsSchema.findById(id);
    if (!result) {
      new CommonException(404, `News not found.`);
    }
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
    const aggPagination: any = new Pagination(limit, page, aggregate);
    const results = await this.newsSchema.aggregate(aggPagination);
    return results;
  }

  async updateNews(id: string, updateDto: UpdateNewDto) {
    await this.newsSchema.findByIdAndUpdate(id, updateDto);
    const getNew = await this.findNewById(id);

    return getNew;
  }

  async deleteNews(id: string) {
    await this.findNewById(id);
    await this.newsSchema.findByIdAndDelete(id);
  }
}
