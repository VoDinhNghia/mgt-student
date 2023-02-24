import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonException } from 'src/abstracts/execeptionError';
import { ValidateField } from 'src/abstracts/validateFieldById';
import {
  Attachment,
  AttachmentDocument,
} from '../attachments/schemas/attachments.schema';
import { Users, UsersDocument } from '../users/schemas/users.schema';
import { CreateUnionDto } from './dtos/unions.create.dto';
import { Union, UnionDocument } from './schemas/unions.schema';

@Injectable()
export class UnionsService {
  constructor(
    @InjectModel(Union.name) private readonly unionSchema: Model<UnionDocument>,
    @InjectModel(Users.name)
    private readonly userSchema: Model<UsersDocument>,
    @InjectModel(Attachment.name)
    private readonly attachmentSchema: Model<AttachmentDocument>,
    private readonly validate: ValidateField,
  ) {}

  async validateUnion(unionDto: Record<string, any>): Promise<void> {
    const { images = [], members = [] } = unionDto;
    if (images.length > 0) {
      for (const item of images) {
        await this.validate.byId(
          this.attachmentSchema,
          item.attachment,
          `Attachment ${item.attachment}`,
        );
      }
    }
    if (members.length > 0) {
      for (const item of members) {
        await this.validate.byId(
          this.userSchema,
          item.user,
          `User ${item.user}`,
        );
      }
    }
  }

  async createUnion(unionDto: CreateUnionDto): Promise<Union> {
    await this.validateUnion(unionDto);
    const union = await new this.unionSchema(unionDto).save();
    const result = await this.findUnionById(union._id);
    return result;
  }

  async findUnionById(id: string): Promise<Union> {
    const result = await this.unionSchema
      .findById(id)
      .populate('members.user', '', this.userSchema)
      .populate('images.attachment', '', this.attachmentSchema)
      .exec();
    if (!result) {
      new CommonException(404, 'Union not found.');
    }
    return result;
  }
}
