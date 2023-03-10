import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { LookupCommon } from 'src/utils/lookup.query.aggregate-query';
import { Pagination } from 'src/utils/page.pagination';
import { ValidateDto } from 'src/validates/validate.common.dto';
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

  async createNews(createNewDto: CreateNewDto): Promise<News> {
    const { attachment = [] } = createNewDto;
    const attachmentIds = await new ValidateDto().idLists(
      'attachments',
      attachment,
    );
    createNewDto.attachment = attachmentIds;
    const news = await new this.newsSchema(createNewDto).save();
    const result = await this.findNewsById(news._id);
    return result;
  }

  async findNewsById(id: string): Promise<News> {
    const match: Record<string, any> = {
      $match: { _id: new Types.ObjectId(id) },
    };
    const lookup = this.lookupNews();
    const aggregate = [match, ...lookup];
    const result = await this.newsSchema.aggregate(aggregate);
    if (!result[0]) {
      new CommonException(404, `News not found.`);
    }
    return result[0];
  }

  async findAllNews(query: QueryNewDto): Promise<News[]> {
    const { limit, page, type } = query;
    const match: Record<string, any> = { $match: {} };
    if (type) {
      match.$match.type = type;
    }
    const agg = [match];
    const aggPagination: any = new Pagination(limit, page, agg);
    const lookup = this.lookupNews();
    const aggregate = [...aggPagination, ...lookup];
    const results = await this.newsSchema.aggregate(aggregate);
    return results;
  }

  async updateNews(id: string, updateDto: UpdateNewDto): Promise<News> {
    const { attachment = [] } = updateDto;
    if (attachment.length > 0) {
      const attachmentIds = await new ValidateDto().idLists(
        'attachments',
        attachment,
      );
      updateDto.attachment = attachmentIds;
    }
    await this.newsSchema.findByIdAndUpdate(id, updateDto);
    const getNew = await this.findNewsById(id);

    return getNew;
  }

  async deleteNews(id: string): Promise<void> {
    await this.findNewsById(id);
    await this.newsSchema.findByIdAndDelete(id);
  }

  private lookupNews() {
    const lookup: any = new LookupCommon([
      {
        from: 'attachments',
        localField: 'attachment',
        foreignField: '_id',
        as: 'attachment',
        unwind: false,
      },
    ]);
    return lookup;
  }
}
