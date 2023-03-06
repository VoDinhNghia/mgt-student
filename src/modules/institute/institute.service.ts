import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonException } from 'src/exceptions/execeptionError';
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

  async validateProfile(profile: string): Promise<void> {
    const profileInfo = await this.profileSchema.findById(profile);
    if (!profileInfo) {
      new CommonException(404, 'User profile not found.');
    }
  }

  async validateInstitute(dto: CreateInstituteDto): Promise<void> {
    const { parson, viceParson, contacts = {} } = dto;
    if (parson) {
      await this.validateProfile(parson);
    }
    if (viceParson) {
      await this.validateProfile(viceParson);
    }
    if (contacts.office) {
      const roomInfo = await this.roomSchema.findById(contacts?.office);
      if (!roomInfo) {
        new CommonException(404, 'Room office not found');
      }
    }
  }

  async createInstitute(dto: CreateInstituteDto): Promise<Institudes> {
    await this.validateInstitute(dto);
    const newDocument = await new this.institutiSchema(dto).save();
    const result = await this.findInstituteById(newDocument._id);
    return result;
  }

  async updateInstitute(
    id: string,
    dto: UpdateInstituteDto,
  ): Promise<Institudes> {
    await this.validateInstitute(dto);
    await this.institutiSchema.findByIdAndUpdate(id, dto);
    const result = await this.findInstituteById(id);
    return result;
  }

  async findInstituteById(id: string): Promise<Institudes> {
    const result = await this.institutiSchema
      .findById(id)
      .populate('parson', '', this.profileSchema)
      .populate('viceParson', '', this.profileSchema)
      .populate('contacts.office', '', this.roomSchema)
      .populate('attachment', '', this.attachmentSchema)
      .exec();
    if (!result) {
      new CommonException(404, 'Institute not found.');
    }
    return result;
  }

  async findAllInstitudes(): Promise<Institudes[]> {
    const results = await this.institutiSchema
      .find({})
      .populate('parson', '', this.profileSchema)
      .populate('viceParson', '', this.profileSchema)
      .populate('contacts.office', '', this.roomSchema)
      .populate('attachment', '', this.attachmentSchema)
      .exec();
    return results;
  }

  async deleteInstitude(id: string): Promise<void> {
    await this.findInstituteById(id);
    await this.institutiSchema.findByIdAndDelete(id);
  }
}
