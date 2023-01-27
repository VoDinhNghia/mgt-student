import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Attachment, AttachmentDocument } from './schemas/attachments.schema';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectModel(Attachment.name)
    private readonly attachmentSchema: Model<AttachmentDocument>,
  ) {}

  async createAttachment(file: Record<string, any>, uploadBy: string) {
    const attachment = await new this.attachmentSchema({
      ...file,
      uploadBy,
    }).save();
    return attachment;
  }
}
