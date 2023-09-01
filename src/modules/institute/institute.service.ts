import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  instituteMsg,
  roomMsg,
} from 'src/constants/constants.message.response';
import { CommonException } from 'src/exceptions/execeptions.common-error';
import {
  selectAttachment,
  selectRoom,
  selectProfile,
} from 'src/utils/utils.populate';
import { ValidFields } from 'src/validates/validates.fields-id-dto';
import {
  Attachment,
  AttachmentDocument,
} from '../attachments/schemas/attachments.schema';
import { Rooms, RoomsDocument } from '../rooms/schemas/rooms.schema';
import {
  Profile,
  ProfileDocument,
} from '../users/schemas/users.profile.schema';
import { CreateInstituteDto } from './dtos/institute.create.dto';
import { QueryIntituteDto } from './dtos/institute.query.dto';
import { UpdateInstituteDto } from './dtos/institute.update.dto';
import { IqueryInstitute } from './interfaces/institute.find.match.interface';
import { InstitudeDocument, Institudes } from './schemas/institute.schema';
import { HttpStatusCode } from 'src/constants/constants.http-status';

@Injectable()
export class InstituteService {
  constructor(
    @InjectModel(Institudes.name)
    private readonly institutiSchema: Model<InstitudeDocument>,
    @InjectModel(Profile.name)
    private readonly profileSchema: Model<ProfileDocument>,
    @InjectModel(Attachment.name)
    private readonly attachmentSchema: Model<AttachmentDocument>,
    @InjectModel(Rooms.name)
    private readonly roomSchema: Model<RoomsDocument>,
  ) {}

  async createInstitute(
    instituteDto: CreateInstituteDto,
    createdBy: string,
  ): Promise<Institudes> {
    const { viceParson, parson, attachment = [], contacts = {} } = instituteDto;
    const valid = new ValidFields();
    await valid.id(this.profileSchema, parson, instituteMsg.notFoundParson);
    await valid.id(
      this.profileSchema,
      viceParson,
      instituteMsg.notFoundViceParson,
    );
    await valid.id(this.roomSchema, contacts.office, roomMsg.notFound);
    if (attachment.length > 0) {
      const attachmentIds = await valid.idList(
        this.attachmentSchema,
        attachment,
      );
      instituteDto.attachment = attachmentIds;
    }
    const result = await new this.institutiSchema({
      ...instituteDto,
      createdBy,
    }).save();
    return result;
  }

  async updateInstitute(
    id: string,
    instituteDto: UpdateInstituteDto,
    updatedBy: string,
  ): Promise<Institudes> {
    const { viceParson, parson, attachment = [], contacts = {} } = instituteDto;
    const valid = new ValidFields();
    if (parson) {
      await valid.id(this.profileSchema, parson, instituteMsg.notFoundParson);
    }
    if (viceParson) {
      await valid.id(
        this.profileSchema,
        viceParson,
        instituteMsg.notFoundViceParson,
      );
    }
    if (contacts.office) {
      await valid.id(this.roomSchema, contacts.office, roomMsg.notFound);
    }
    if (attachment.length > 0) {
      const attachmentIds = await new ValidFields().idList(
        this.attachmentSchema,
        attachment,
      );
      instituteDto.attachment = attachmentIds;
    }
    const updateDto = {
      ...instituteDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.institutiSchema.findByIdAndUpdate(id, updateDto, {
      new: true,
    });
    return result;
  }

  async findInstituteById(id: string): Promise<Institudes> {
    const result = await this.institutiSchema
      .findById(id)
      .populate('attachment', selectAttachment, this.attachmentSchema, {
        isDeleted: false,
      })
      .populate('parson', selectProfile, this.profileSchema, {
        isDeleted: false,
      })
      .populate('viceParson', selectProfile, this.profileSchema, {
        isDeleted: false,
      })
      .populate('contacts.office', selectRoom, this.roomSchema, {
        isDeleted: false,
      })
      .exec();
    if (!result) {
      new CommonException(HttpStatusCode.NOT_FOUND, instituteMsg.notFound);
    }
    return result;
  }

  async findAllInstitudes(
    queryDto: QueryIntituteDto,
  ): Promise<{ results: Institudes[]; total: number }> {
    const { limit, page, searchKey } = queryDto;
    const query: IqueryInstitute = { isDeleted: false };
    if (searchKey) {
      query.unitName = new RegExp(searchKey, 'i');
    }
    const results = await this.institutiSchema
      .find(query)
      .skip(limit && page ? Number(limit) * Number(page) - Number(limit) : null)
      .limit(limit ? Number(limit) : null)
      .populate('attachment', selectAttachment, this.attachmentSchema, {
        isDeleted: false,
      })
      .populate('parson', selectProfile, this.profileSchema, {
        isDeleted: false,
      })
      .populate('viceParson', selectProfile, this.profileSchema, {
        isDeleted: false,
      })
      .populate('contacts.office', selectRoom, this.roomSchema, {
        isDeleted: false,
      })
      .sort({ createdAt: -1 })
      .exec();
    const total = await this.institutiSchema.find(query).count();
    return { results, total };
  }

  async deleteInstitude(id: string, deletedBy: string): Promise<void> {
    await this.findInstituteById(id);
    const dto = {
      isDeleted: true,
      deletedBy,
      deletedAt: Date.now(),
    };
    await this.institutiSchema.findByIdAndUpdate(id, dto);
  }
}
