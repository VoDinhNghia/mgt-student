import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { newsMsg } from 'src/constants/constants.message.response';
import { CommonException } from 'src/exceptions/execeptions.common-error';
import { selectAttachment } from 'src/utils/utils.populate';
import { ValidFields } from 'src/validates/validates.fields-id-dto';
import {
  Attachment,
  AttachmentDocument,
} from '../attachments/schemas/attachments.schema';
import { CreateNewDto } from './dtos/news.create.dto';
import { QueryNewDto } from './dtos/news.query.dto';
import { UpdateNewDto } from './dtos/news.update.dto';
import { IqueryNews } from './interfaces/news.find.match.interface';
import { News, NewsDocument } from './schemas/news.schema';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name)
    private readonly newsSchema: Model<NewsDocument>,
    @InjectModel(Attachment.name)
    private readonly attachmentSchema: Model<AttachmentDocument>,
  ) {}

  async createNews(
    createNewDto: CreateNewDto,
    createdBy: string,
  ): Promise<News> {
    const { attachment = [] } = createNewDto;
    if (attachment.length > 0) {
      const ids = await new ValidFields().idList(
        this.attachmentSchema,
        attachment,
      );
      createNewDto.attachment = ids;
    }
    const dto = {
      ...createNewDto,
      createdBy,
    };
    const result = await new this.newsSchema(dto).save();
    return result;
  }

  async findNewsById(id: string): Promise<News> {
    const result = await this.newsSchema
      .findById(id)
      .populate('attachment', selectAttachment, this.attachmentSchema, {
        isDeleted: false,
      })
      .exec();
    if (!result) {
      new CommonException(404, newsMsg.notFound);
    }
    return result;
  }

  async findAllNews(
    queryDto: QueryNewDto,
  ): Promise<{ results: News[]; total: number }> {
    const { limit, page, type, searchKey } = queryDto;
    const query: IqueryNews = { isDeleted: false };
    if (type) {
      query.type = type;
    }
    if (searchKey) {
      query.title = new RegExp(searchKey, 'i');
    }
    const results = await this.newsSchema
      .find(query)
      .skip(limit && page ? Number(limit) * Number(page) - Number(limit) : null)
      .limit(limit ? Number(limit) : null)
      .populate('attachment', selectAttachment, this.attachmentSchema, {
        isDeleted: false,
      })
      .sort({ createdAt: -1 })
      .exec();
    const total = await this.newsSchema.find(query).count();
    return { results, total };
  }

  async updateNews(
    id: string,
    updateDto: UpdateNewDto,
    updatedBy: string,
  ): Promise<News> {
    const { attachment = [] } = updateDto;
    if (attachment.length > 0) {
      const ids = await new ValidFields().idList(
        this.attachmentSchema,
        attachment,
      );
      updateDto.attachment = ids;
    }
    const dto = {
      ...updateDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.newsSchema.findByIdAndUpdate(id, dto, {
      new: true,
    });
    return result;
  }

  async deleteNews(id: string, deletedBy: string): Promise<void> {
    await this.findNewsById(id);
    const dto = {
      isDeleted: true,
      deletedBy,
      deletedAt: Date.now(),
    };
    await this.newsSchema.findByIdAndUpdate(id, dto);
  }
}
