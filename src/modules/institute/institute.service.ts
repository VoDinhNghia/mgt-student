import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  instituteMsg,
  msgNotFound,
  roomMsg,
} from 'src/constants/constants.message.response';
import { CommonException } from 'src/exceptions/execeptions.common-error';
import { instituteLookup } from 'src/utils/utils.lookup.query.service';
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
import { UpdateInstituteDto } from './dtos/institute.update.dto';
import { ImatchFindInstitute } from './interfaces/institute.find.match.interface';
import { InstitudeDocument, Institudes } from './schemas/institute.schema';

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
    const match: ImatchFindInstitute = {
      $match: { _id: new Types.ObjectId(id) },
    };
    const lookup = instituteLookup();
    const aggregate = [match, ...lookup];
    const result = await this.institutiSchema.aggregate(aggregate);
    if (!result[0]) {
      new CommonException(404, msgNotFound);
    }
    return result[0];
  }

  async findAllInstitudes(): Promise<Institudes[]> {
    const match: ImatchFindInstitute = { $match: { isDeleted: false } };
    const lookup = instituteLookup();
    const aggregate = [match, ...lookup];
    const results = await this.institutiSchema.aggregate(aggregate);
    return results;
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
