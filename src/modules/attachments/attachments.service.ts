import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { unlinkSync } from 'fs';
import { Model, Types } from 'mongoose';
import { urlAccessImageLocal } from 'src/constants/constant';
import { CommonException } from 'src/exceptions/exeception.common-error';
import {
  Profile,
  ProfileDocument,
} from '../users/schemas/users.profile.schema';
import { Attachment, AttachmentDocument } from './schemas/attachments.schema';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectModel(Attachment.name)
    private readonly attachmentSchema: Model<AttachmentDocument>,
    @InjectModel(Profile.name)
    private readonly profileSchema: Model<ProfileDocument>,
  ) {}

  // posible save at difference server or amazon s3 service

  async createAttachment(file: Record<string, any>, uploadBy: string) {
    const attachment = await new this.attachmentSchema({
      ...file,
      uploadBy,
    }).save();
    return attachment;
  }

  async getAttachmentById(id: string): Promise<string> {
    const result = await this.attachmentSchema.findById(id);
    if (!result) {
      new CommonException(404, 'Attachment not found.');
    }
    const url = `${urlAccessImageLocal}/${result.filename}`;
    return url;
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
