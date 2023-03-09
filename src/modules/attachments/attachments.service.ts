import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { unlinkSync } from 'fs';
import { Model, Types } from 'mongoose';
import { urlAccessImageLocal } from 'src/constants/constant';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { FileRequestDto } from 'src/utils/file-request.dto';
import { CreateAttachmentDto } from './dtos/attachments.create.dto';
import { Attachment, AttachmentDocument } from './schemas/attachments.schema';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectModel(Attachment.name)
    private readonly attachmentSchema: Model<AttachmentDocument>,
  ) {}

  async createAttachment(
    fileDto: FileRequestDto,
    uploadBy: string,
  ): Promise<Attachment> {
    const attachmentDto: CreateAttachmentDto = {
      ...fileDto,
      url: `${urlAccessImageLocal}/${fileDto.filename}`,
      uploadBy,
    };
    const attachment = await new this.attachmentSchema(attachmentDto).save();
    return attachment;
  }

  async getAttachmentById(id: string): Promise<Attachment> {
    const result = await this.attachmentSchema.findById(id);
    if (!result) {
      new CommonException(404, 'Attachment not found.');
    }
    return result;
  }

  async deleteAttachment(id: string, profileId: string): Promise<void> {
    const result = await this.attachmentSchema.findOne({
      _id: new Types.ObjectId(id),
      uploadBy: new Types.ObjectId(profileId),
    });
    if (!result) {
      new CommonException(404, 'Attachment not found.');
    }
    try {
      await this.attachmentSchema.findByIdAndDelete(id);
    } catch (error) {
      console.log(error);
      new CommonException(500, 'Server error.');
    }
    unlinkSync(result.path);
  }
}
