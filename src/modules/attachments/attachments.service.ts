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

  createAttachment() {
    return 0;
  }
}
