import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonException } from 'src/abstracts/execeptionError';
import {
  Attachment,
  AttachmentDocument,
} from '../attachments/schemas/attachments.schema';
import { CreateAwardDto } from './dtos/awards.create.dto';
import { UpdateAwardDto } from './dtos/awards.update.dto';
import { Award, AwardDocument } from './schemas/awards.schema';

@Injectable()
export class AwardsService {
  constructor(
    @InjectModel(Award.name)
    private readonly awardSchema: Model<AwardDocument>,
    @InjectModel(Attachment.name)
    private readonly attachmentSchema: Model<AttachmentDocument>,
  ) {}

  async createAward(createAwardDto: CreateAwardDto): Promise<Award> {
    const result = await new this.awardSchema(createAwardDto).save();
    return result;
  }

  async findOneAward(options: Record<string, any>): Promise<Award> {
    const result = await this.awardSchema
      .findOne(options)
      .populate('attachment', '', this.attachmentSchema)
      .exec();
    if (!result) {
      new CommonException(404, `Award not found.`);
    }
    return result;
  }

  async findAwardById(id: string): Promise<Award> {
    const result = await this.awardSchema
      .findById(id)
      .populate('attachment', '', this.attachmentSchema);
    if (!result) {
      new CommonException(404, `Award not found.`);
    }
    return result;
  }

  async updateAward(id: string, updateAwardDto: UpdateAwardDto): Promise<void> {
    await this.findAwardById(id);
    await this.awardSchema.findByIdAndUpdate(id, updateAwardDto);
  }

  async deleteAward(id: string): Promise<void> {
    await this.findAwardById(id);
    await this.awardSchema.findByIdAndDelete(id);
  }
}
