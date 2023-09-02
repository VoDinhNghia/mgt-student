import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  attachmentMsg,
  unionMsg,
  userMsg,
} from 'src/constants/constants.message.response';
import { CommonException } from 'src/exceptions/execeptions.common-error';
import { Igroup } from 'src/utils/utils.interface';
import { selectAttachment, selectUnion } from 'src/utils/utils.populate';
import { ValidFields } from 'src/validates/validates.fields-id-dto';
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
import { QueryUnionDto } from './dtos/unions.query.dto';
import { QueryUnionImageDto } from './dtos/unions.query.image.dto';
import { QueryUnionMemberDto } from './dtos/unions.query.member.dto';
import { UpdateUnionDto } from './dtos/unions.update.dto';
import { UpdateUnionImage } from './dtos/unions.update.image.dto';
import { UpdateUnionMember } from './dtos/unions.update.member.dto';
import {
  IqueryUnion,
  IunionFindAll,
  IunionImageQuery,
  IunionMemberQuery,
} from './interfaces/unions.find.interface';
import { UnionImages } from './schemas/unions.images.schema';
import { UnionMembers } from './schemas/unions.members.schema';
import { Union, UnionDocument } from './schemas/unions.schema';
import { HttpStatusCode } from 'src/constants/constants.http-status';

@Injectable()
export class UnionsService {
  private populateUnion: string = 'union';
  private populateAttachment: string = 'attachment';
  private populateUser: string = 'user';

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

  public async createUnion(
    unionDto: CreateUnionDto,
    createdBy: string,
  ): Promise<Union> {
    const union = await new this.unionSchema({ ...unionDto, createdBy }).save();
    return union;
  }

  public async createUnionMember(
    memberDto: CreateUnionMemberDto,
    createdBy: string,
  ): Promise<UnionMembers> {
    const { union, user } = memberDto;
    await this.findUnionById(union);
    const valid = new ValidFields();
    await valid.id(this.profileSchema, user, userMsg.notFoundProfile);
    const newMemberDto = {
      ...memberDto,
      createdBy,
    };
    const result = await new this.unionMemberSchema(newMemberDto).save();

    return result;
  }

  public async createUnionImage(
    imageDto: CreateUnionImagesDto,
    createdBy: string,
  ): Promise<UnionImages> {
    const { union, attachment } = imageDto;
    await this.findUnionById(union);
    const valid = new ValidFields();
    await valid.id(this.attachmentSchema, attachment, attachmentMsg.notFound);
    const newImageDto = {
      ...imageDto,
      createdBy,
    };
    const result = await new this.unionImageSchema(newImageDto).save();

    return result;
  }

  public async updateUnion(
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

  public async updateUnionMember(
    id: string,
    memberDto: UpdateUnionMember,
    updatedBy: string,
  ): Promise<UnionMembers> {
    const { union, user } = memberDto;
    if (union) {
      await this.findUnionById(union);
    }
    if (user) {
      const valid = new ValidFields();
      await valid.id(this.profileSchema, user, userMsg.notFoundProfile);
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

  public async updateUnionImage(
    id: string,
    imageDto: UpdateUnionImage,
    updatedBy: string,
  ): Promise<UnionMembers> {
    const { union, attachment } = imageDto;
    if (union) {
      await this.findUnionById(union);
    }
    if (attachment) {
      const valid = new ValidFields();
      await valid.id(this.attachmentSchema, attachment, attachmentMsg.notFound);
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

  public async findUnionById(id: string): Promise<IunionFindAll> {
    const result: IunionFindAll = await this.unionSchema.findById(id).lean();
    if (!result) {
      new CommonException(HttpStatusCode.NOT_FOUND, unionMsg.notFound);
    }
    const groupMember = await this.groupMember(result._id);
    const imageList = await this.findAllUnionImages({
      union: String(result._id),
    });

    return { ...result, groupMember, imageList: imageList.results };
  }

  public async findUnionMemberById(id: string): Promise<UnionMembers> {
    const result = await this.unionMemberSchema
      .findById(id)
      .select(selectUnion.member)
      .populate(this.populateUnion, selectUnion.union, this.unionSchema, {
        isDeleted: false,
      })
      .populate(this.populateUser, selectUnion.user, this.profileSchema, {
        isDeleted: false,
      })
      .exec();
    if (!result) {
      new CommonException(HttpStatusCode.NOT_FOUND, unionMsg.notFoundMember);
    }

    return result;
  }

  public async findUnionImageById(id: string): Promise<UnionImages> {
    const result = await this.unionImageSchema
      .findById(id)
      .select(selectUnion.image)
      .populate(this.populateUnion, selectUnion.union, this.unionSchema, {
        isDeleted: false,
      })
      .populate(
        this.populateAttachment,
        selectAttachment,
        this.attachmentSchema,
        {
          isDeleted: false,
        },
      )
      .exec();
    if (!result) {
      new CommonException(HttpStatusCode.NOT_FOUND, unionMsg.notFoundMember);
    }

    return result;
  }

  public async findAllUnions(
    queryDto: QueryUnionDto,
  ): Promise<{ results: IunionFindAll[]; total: number }> {
    const { limit, page, searchKey } = queryDto;
    const query: IqueryUnion = { isDeleted: false };
    if (searchKey) {
      query.nameUnit = new RegExp(searchKey, 'i');
    }
    const results = await this.unionSchema
      .find(query)
      .skip(limit && page ? Number(limit) * Number(page) - Number(limit) : null)
      .limit(limit ? Number(limit) : null)
      .sort({ createdAt: -1 })
      .lean();
    const data: IunionFindAll[] = [];
    for await (const union of results) {
      const groupMember = await this.groupMember(union._id);
      const imageList = await this.findAllUnionImages({
        union: String(union._id),
      });
      data.push({ ...union, groupMember, imageList: imageList.results });
    }
    const total = await this.unionSchema.find(query).count();

    return {
      results: data,
      total,
    };
  }

  public async findAllUnionImages(
    queryDto: QueryUnionImageDto,
  ): Promise<{ results: UnionImages[]; total: number }> {
    const { limit, page, searchKey, union } = queryDto;
    const query: IunionImageQuery = { isDeleted: false };
    if (union) {
      query.union = new Types.ObjectId(union);
    }
    if (searchKey) {
      query.description = new RegExp(searchKey, 'i');
    }
    const results = await this.unionImageSchema
      .find(query)
      .select(selectUnion.image)
      .populate(
        this.populateAttachment,
        selectAttachment,
        this.attachmentSchema,
        {
          isDeleted: false,
        },
      )
      .skip(limit && page ? Number(limit) * Number(page) - Number(limit) : null)
      .limit(limit ? Number(limit) : null)
      .populate(this.populateUnion, selectUnion.union, this.unionSchema, {
        isDeleted: false,
      })
      .sort({ createdAt: -1 })
      .lean();
    const total = await this.unionImageSchema.find(query).count();

    return {
      results,
      total,
    };
  }

  public async findAllUnionMembers(
    queryDto: QueryUnionMemberDto,
  ): Promise<{ results: UnionImages[]; total: number }> {
    const { limit, page, searchKey, union, user } = queryDto;
    const query: IunionMemberQuery = { isDeleted: false };
    if (union) {
      query.union = new Types.ObjectId(union);
    }
    if (user) {
      query.user = new Types.ObjectId(user);
    }
    if (searchKey) {
      query.position = new RegExp(searchKey, 'i');
    }
    const results = await this.unionMemberSchema
      .find(query)
      .select(selectUnion.member)
      .populate(this.populateUser, selectUnion.user, this.profileSchema, {
        isDeleted: false,
      })
      .skip(limit && page ? Number(limit) * Number(page) - Number(limit) : null)
      .limit(limit ? Number(limit) : null)
      .populate(this.populateUnion, selectUnion.union, this.unionSchema, {
        isDeleted: false,
      })
      .sort({ createdAt: -1 })
      .lean();
    const total = await this.unionMemberSchema.find(query).count();

    return {
      results,
      total,
    };
  }

  public async deleteUnion(id: string, deletedBy: string): Promise<void> {
    await this.findUnionById(id);
    const deleteDto = {
      deletedBy,
      isDeleted: true,
      deletedAt: Date.now(),
    };
    await this.unionSchema.findByIdAndUpdate(id, deleteDto);
  }

  public async deleteUnionImage(id: string, deletedBy: string): Promise<void> {
    await this.findUnionById(id);
    const deleteDto = {
      deletedBy,
      isDeleted: true,
      deletedAt: Date.now(),
    };
    await this.unionImageSchema.findByIdAndUpdate(id, deleteDto);
  }

  public async deleteUnionMember(id: string, deletedBy: string): Promise<void> {
    await this.findUnionById(id);
    const deleteDto = {
      deletedBy,
      isDeleted: true,
      deletedAt: Date.now(),
    };
    await this.unionMemberSchema.findByIdAndUpdate(id, deleteDto);
  }

  private async groupMember(unionId: Types.ObjectId): Promise<Igroup[]> {
    const groupMember = await this.unionMemberSchema.aggregate([
      { $match: { union: unionId, isDeleted: false } },
      {
        $group: {
          _id: '$position',
          count: { $count: {} },
        },
      },
    ]);

    return groupMember;
  }
}
