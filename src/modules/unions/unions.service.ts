import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { collections } from 'src/constants/constants.collections.name';
import {
  attachmentMsg,
  unionMsg,
  userMsg,
} from 'src/constants/constants.message.response';
import { CommonException } from 'src/exceptions/execeptions.common-error';
import {
  unionImageLookup,
  unionMemberLookup,
} from 'src/utils/utils.lookup.query.service';
import { ValidateDto } from 'src/validates/validates.common.dto';
import {
  Attachment,
  AttachmentDocument,
} from '../attachments/schemas/attachments.schema';
import {
  Profile,
  ProfileDocument,
} from '../users/schemas/users.profile.schema';
import { CreateUnionDto } from './dtos/unions.create.dto';
import { CreateUnionImagesDto } from './dtos/unions.create.images.dto';
import { CreateUnionMemberDto } from './dtos/unions.create.member.dto';
import { UpdateUnionDto } from './dtos/unions.update.dto';
import { UpdateUnionImage } from './dtos/unions.update.image.dto';
import { UpdateUnionMember } from './dtos/unions.update.member.dto';
import { UnionImages } from './schemas/unions.images.schema';
import { UnionMembers } from './schemas/unions.members.schema';
import { Union, UnionDocument } from './schemas/unions.schema';

@Injectable()
export class UnionsService {
  constructor(
    @InjectModel(Union.name) private readonly unionSchema: Model<UnionDocument>,
    @InjectModel(UnionMembers.name)
    private readonly unionMemberSchema: Model<UnionMembers>,
    @InjectModel(UnionImages.name)
    private readonly unionImageSchema: Model<UnionImages>,
    @InjectModel(Profile.name)
    private readonly profileSchema: Model<ProfileDocument>,
    @InjectModel(Attachment.name)
    private readonly attachmentSchema: Model<AttachmentDocument>,
  ) {}

  async createUnion(
    unionDto: CreateUnionDto,
    createdBy: string,
  ): Promise<Union> {
    const union = await new this.unionSchema({ ...unionDto, createdBy }).save();
    return union;
  }

  async createUnionMember(
    memberDto: CreateUnionMemberDto,
    createdBy: string,
  ): Promise<UnionMembers> {
    const { union, user } = memberDto;
    await this.findUnionById(union);
    const userProfile = await this.profileSchema.findById(user);
    if (!userProfile) {
      new CommonException(404, userMsg.notFoundProfile);
    }
    const newMemberDto = {
      ...memberDto,
      createdBy,
    };
    const result = await new this.unionMemberSchema(newMemberDto).save();
    return result;
  }

  async createUnionImage(
    imageDto: CreateUnionImagesDto,
    createdBy: string,
  ): Promise<UnionImages> {
    const { union, attachment } = imageDto;
    await this.findUnionById(union);
    const attachmentInfo = await this.attachmentSchema.findById(attachment);
    if (!attachmentInfo) {
      new CommonException(404, attachmentMsg.notFound);
    }
    const newImageDto = {
      ...imageDto,
      createdBy,
    };
    const result = await new this.unionImageSchema(newImageDto).save();
    return result;
  }

  async updateUnion(
    id: string,
    unionDto: UpdateUnionDto,
    updatedBy: string,
  ): Promise<Union> {
    await this.findUnionById(id);
    const updateDto = {
      ...unionDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.unionSchema.findByIdAndUpdate(id, updateDto, {
      new: true,
    });
    return result;
  }

  async updateUnionMember(
    id: string,
    memberDto: UpdateUnionMember,
    updatedBy: string,
  ): Promise<UnionMembers> {
    const { union, user } = memberDto;
    if (union) {
      await this.findUnionById(union);
    }
    if (user) {
      const userProfile = await this.profileSchema.findById(user);
      if (!userProfile) {
        new CommonException(404, userMsg.notFoundProfile);
      }
    }
    const updateMemberDto = {
      ...memberDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.unionMemberSchema.findByIdAndUpdate(
      id,
      updateMemberDto,
      { new: true },
    );
    return result;
  }

  async updateUnionImage(
    id: string,
    imageDto: UpdateUnionImage,
    updatedBy: string,
  ): Promise<UnionMembers> {
    const { union, attachment } = imageDto;
    if (union) {
      await this.findUnionById(union);
    }
    if (attachment) {
      await new ValidateDto().fieldId(collections.attachments, attachment);
    }
    const updateImageDto = {
      ...imageDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.unionImageSchema.findByIdAndUpdate(
      id,
      updateImageDto,
      { new: true },
    );
    return result;
  }

  async findUnionById(id: string): Promise<Union> {
    const result = await this.unionSchema.findById(id);
    if (!result) {
      new CommonException(404, unionMsg.notFound);
    }
    return result;
  }

  async findUnionMemberById(id: string): Promise<UnionMembers> {
    const match = { $match: { _id: new Types.ObjectId(id) } };
    const lookup = unionMemberLookup();
    const result = await this.unionMemberSchema.aggregate([
      match,
      ...lookup,
      { $limit: 1 },
    ]);
    if (!result[0]) {
      new CommonException(404, unionMsg.notFoundMember);
    }
    return result[0];
  }

  async findUnionImageById(id: string): Promise<UnionImages> {
    const match = { $match: { _id: new Types.ObjectId(id) } };
    const lookup = unionImageLookup();
    const result = await this.unionImageSchema.aggregate([
      match,
      ...lookup,
      { $limit: 1 },
    ]);
    if (!result[0]) {
      new CommonException(404, unionMsg.notFoundImage);
    }
    return result[0];
  }

  async findAllUnions(): Promise<Union[]> {
    const results = await this.unionSchema.find({ isDeleted: false });
    return results;
  }

  async deleteUnion(id: string, deletedBy: string): Promise<void> {
    const deleteDto = {
      deletedBy,
      isDeleted: true,
      deletedAt: Date.now(),
    };
    await this.findUnionById(id);
    await this.unionSchema.findByIdAndUpdate(id, deleteDto);
  }
}
