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
import { deleteBody } from 'src/utils/utils.delete-body';

@Injectable()
export class InstituteService {
  private populateAttachment: string = 'attachment';
  private populateParson: string = 'parson';
  private populateViceParson: string = 'viceParson';
  private populateOffice: string = 'contacts.office';

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

  public async createInstitute(
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

  public async updateInstitute(
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

  public async findInstituteById(id: string): Promise<Institudes> {
    const result = await this.institutiSchema
      .findById(id)
      .populate(
        this.populateAttachment,
        selectAttachment,
        this.attachmentSchema,
        {
          isDeleted: false,
        },
      )
      .populate(this.populateParson, selectProfile, this.profileSchema, {
        isDeleted: false,
      })
      .populate(this.populateViceParson, selectProfile, this.profileSchema, {
        isDeleted: false,
      })
      .populate(this.populateOffice, selectRoom, this.roomSchema, {
        isDeleted: false,
      })
      .exec();
    if (!result) {
      new CommonException(HttpStatusCode.NOT_FOUND, instituteMsg.notFound);
    }

    return result;
  }

  public async findAllInstitudes(
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
      .populate(
        this.populateAttachment,
        selectAttachment,
        this.attachmentSchema,
        {
          isDeleted: false,
        },
      )
      .populate(this.populateParson, selectProfile, this.profileSchema, {
        isDeleted: false,
      })
      .populate(this.populateViceParson, selectProfile, this.profileSchema, {
        isDeleted: false,
      })
      .populate(this.populateOffice, selectRoom, this.roomSchema, {
        isDeleted: false,
      })
      .sort({ createdAt: -1 })
      .exec();
    const total = await this.institutiSchema.find(query).count();

    return { results, total };
  }

  public async deleteInstitude(id: string, deletedBy: string): Promise<void> {
    await this.findInstituteById(id);
    const dto = deleteBody();
    await this.institutiSchema.findByIdAndUpdate(id, { ...dto, deletedBy });
  }
}
