import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { msgNotFound } from 'src/constants/constants.message.response';
import { CommonException } from 'src/exceptions/execeptions.common-error';
import { selectAttachment } from 'src/utils/utils.populate';
import { ValidFields } from 'src/validates/validates.fields-id-dto';
import {
  Attachment,
  AttachmentDocument,
} from '../attachments/schemas/attachments.schema';
import { CreateAwardDto } from './dtos/awards.create.dto';
import { QueryAwardDto } from './dtos/awards.query.dto';
import { UpdateAwardDto } from './dtos/awards.update.dto';
import { IqueryAwards } from './interfaces/awards.find.match.interface';
import { Award, AwardDocument } from './schemas/awards.schema';
import { HttpStatusCode } from 'src/constants/constants.http-status';

@Injectable()
export class AwardsService {
  constructor(
    @InjectModel(Award.name)
    private readonly awardSchema: Model<AwardDocument>,
    @InjectModel(Attachment.name)
    private readonly attachmentSchema: Model<AttachmentDocument>,
  ) {}

  async createAward(
    createDto: CreateAwardDto,
    createdBy: string,
  ): Promise<Award> {
    const { attachment = [] } = createDto;
    if (attachment.length > 0) {
      const attachmentIds = await new ValidFields().idList(
        this.attachmentSchema,
        attachment,
      );
      createDto.attachment = attachmentIds;
    }
    const result = await new this.awardSchema({
      ...createDto,
      createdBy,
    }).save();
    return result;
  }

  async findAwardById(id: string): Promise<Award> {
    const result = await this.awardSchema
      .findById(id)
      .populate('attachment', selectAttachment, this.attachmentSchema, {
        isDeleted: false,
      })
      .exec();
    if (!result) {
      new CommonException(HttpStatusCode.NOT_FOUND, msgNotFound);
    }
    return result;
  }

  async updateAward(
    id: string,
    updateDto: UpdateAwardDto,
    updatedBy: string,
  ): Promise<Award> {
    const { attachment = [] } = updateDto;
    if (attachment.length > 0) {
      const attachmentIds = await new ValidFields().idList(
        this.attachmentSchema,
        attachment,
      );
      updateDto.attachment = attachmentIds;
    }
    const newDto = {
      ...updateDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.awardSchema.findByIdAndUpdate(id, newDto, {
      new: true,
    });
    return result;
  }

  async deleteAward(id: string, deletedBy: string): Promise<void> {
    const deleteDto = {
      isDeleted: true,
      deletedBy,
      deletedAt: Date.now(),
    };
    await this.awardSchema.findByIdAndUpdate(id, deleteDto);
  }

  async findAllAward(
    queryDto: QueryAwardDto,
  ): Promise<{ results: Award[]; total: number }> {
    const { limit, page, searchKey, type, fromDate, toDate } = queryDto;
    const query: IqueryAwards = { isDeleted: false };
    if (searchKey) {
      query.name = new RegExp(searchKey, 'i');
    }
    if (type) {
      query.type = type;
    }
    if (fromDate && !toDate) {
      query.time = { $gte: new Date(fromDate) };
    }
    if (!fromDate && toDate) {
      query.time = { $lte: new Date(toDate) };
    }
    if (fromDate && toDate) {
      query.time = { $gte: new Date(fromDate), $lte: new Date(toDate) };
    }
    const results = await this.awardSchema
      .find(query)
      .skip(limit && page ? Number(limit) * Number(page) - Number(limit) : null)
      .limit(limit ? Number(limit) : null)
      .populate('attachment', selectAttachment, this.attachmentSchema, {
        isDeleted: false,
      })
      .sort({ createAt: -1 })
      .exec();
    const total = await this.awardSchema.find(query).count();
    return { results, total };
  }
}
