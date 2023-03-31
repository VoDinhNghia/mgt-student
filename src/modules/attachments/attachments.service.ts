import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { unlinkSync } from 'fs';
import { Model, Types } from 'mongoose';
import {
  msgServerError,
  attachmentMsg,
} from 'src/constants/constants.message.response';
import { CommonException } from 'src/exceptions/execeptions.common-error';
import { FileRequestDto } from 'src/utils/utils.file-request.dto';
import { selectAttachment } from 'src/utils/utils.populate';
import { CreateAttachmentDto } from './dtos/attachments.create.dto';
import { QueryAttachmentUserDto } from './dtos/attachments.query-by-user.dto';
import { QueryAttachmentDto } from './dtos/attachments.query.dto';
import { IqueryAttachments } from './interfaces/attachments.interface';
import { Attachment, AttachmentDocument } from './schemas/attachments.schema';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectModel(Attachment.name)
    private readonly attachmentSchema: Model<AttachmentDocument>,
    private readonly configService: ConfigService,
  ) {}

  async createAttachment(
    fileDto: FileRequestDto,
    uploadBy: string,
  ): Promise<Attachment> {
    const attachmentDto: CreateAttachmentDto = {
      ...fileDto,
      url: `${this.configService.get('VIEW_IMAGE_URL')}/${fileDto.filename}`,
      uploadBy,
    };
    const attachment = await new this.attachmentSchema(attachmentDto).save();
    const result = await this.getAttachmentById(attachment._id);
    return result;
  }

  async getAttachmentById(id: string): Promise<Attachment> {
    const result = await this.attachmentSchema
      .findById(id)
      .select(selectAttachment)
      .exec();
    if (!result) {
      new CommonException(404, attachmentMsg.notFound);
    }
    return result;
  }

  async findAllAttachments(
    queryDto: QueryAttachmentDto,
  ): Promise<{ results: Attachment[]; total: number }> {
    const { limit, page, searchKey, mimetype, uploadBy } = queryDto;
    const query: IqueryAttachments = {};
    if (mimetype) {
      query.mimetype = mimetype;
    }
    if (uploadBy) {
      query.uploadBy = new Types.ObjectId(uploadBy);
    }
    if (searchKey) {
      query.originalname = new RegExp(searchKey, 'i');
    }
    const results = await this.attachmentSchema
      .find(query)
      .skip(limit && page ? Number(limit) * Number(page) - Number(limit) : null)
      .limit(limit ? Number(limit) : null)
      .sort({ createdAt: -1 })
      .exec();
    const total = await this.attachmentSchema.find(query).count();
    return { results, total };
  }

  async findAttachmentUsers(
    queryDto: QueryAttachmentUserDto,
    user: string,
  ): Promise<{ results: Attachment[]; total: number }> {
    const { limit, page, searchKey, mimetype } = queryDto;
    const query: IqueryAttachments = { uploadBy: new Types.ObjectId(user) };
    if (mimetype) {
      query.mimetype = mimetype;
    }
    if (searchKey) {
      query.originalname = new RegExp(searchKey, 'i');
    }
    const results = await this.attachmentSchema
      .find(query)
      .skip(limit && page ? Number(limit) * Number(page) - Number(limit) : null)
      .limit(limit ? Number(limit) : null)
      .sort({ createdAt: -1 })
      .exec();
    const total = await this.attachmentSchema.find(query).count();
    return { results, total };
  }

  async deleteAttachment(id: string, profileId: string): Promise<void> {
    const result = await this.attachmentSchema.findOne({
      _id: new Types.ObjectId(id),
      uploadBy: new Types.ObjectId(profileId),
    });
    if (!result) {
      new CommonException(404, attachmentMsg.notFound);
    }
    try {
      await this.attachmentSchema.findByIdAndDelete(id);
    } catch (error) {
      console.log(error);
      new CommonException(500, msgServerError);
    }
    unlinkSync(result.path);
  }
}
