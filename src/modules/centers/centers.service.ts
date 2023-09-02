import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommonException } from 'src/exceptions/execeptions.common-error';
import { CreateCenterDto } from './dtos/centers.create.dto';
import { Center, CenterDocument } from './schemas/centers.schema';
import { UpdateCenterDto } from './dtos/centers.update.dto';
import {
  centerMsg,
  roomMsg,
  userMsg,
} from 'src/constants/constants.message.response';
import { ValidFields } from 'src/validates/validates.fields-id-dto';
import {
  Profile,
  ProfileDocument,
} from '../users/schemas/users.profile.schema';
import { Award, AwardDocument } from '../awards/schemas/awards.schema';
import { Rooms, RoomsDocument } from '../rooms/schemas/rooms.schema';
import {
  selectAward,
  selectProfile,
  selectRoom,
} from 'src/utils/utils.populate';
import { QueryCenterDto } from './dtos/centers.query.dto';
import { IqueryCenter } from './interfaces/centers.interface';
import { HttpStatusCode } from 'src/constants/constants.http-status';

@Injectable()
export class CenterService {
  private populateDirector: string = 'director';
  private populateAward: string = 'award';
  private populateOffice: string = 'contacts.office';

  constructor(
    @InjectModel(Center.name)
    private readonly centerSchema: Model<CenterDocument>,
    @InjectModel(Profile.name)
    private readonly profileSchema: Model<ProfileDocument>,
    @InjectModel(Award.name)
    private readonly awardSchema: Model<AwardDocument>,
    @InjectModel(Rooms.name)
    private readonly roomSchema: Model<RoomsDocument>,
  ) {}

  public async createCenter(
    centerDto: CreateCenterDto,
    createdBy: string,
  ): Promise<Center> {
    const { award = [], director, contacts = {} } = centerDto;
    const valid = new ValidFields();
    await valid.id(this.profileSchema, director, userMsg.notFoundProfile);
    await valid.id(this.roomSchema, contacts.office, roomMsg.notFound);
    if (award.length > 0) {
      const awardIds = await valid.idList(this.awardSchema, award);
      centerDto.award = awardIds;
    }
    const result = await new this.centerSchema({
      ...centerDto,
      createdBy,
    }).save();

    return result;
  }

  public async updateCenter(
    id: string,
    centerDto: UpdateCenterDto,
    updatedBy: string,
  ): Promise<Center> {
    const { award = [], director, contacts = {} } = centerDto;
    const valid = new ValidFields();
    if (director) {
      await valid.id(this.profileSchema, director, userMsg.notFoundProfile);
    }
    if (contacts.office) {
      await valid.id(this.roomSchema, contacts.office, roomMsg.notFound);
    }
    if (award.length > 0) {
      const awardIds = await valid.idList(this.awardSchema, award);
      centerDto.award = awardIds;
    }
    const updateDto = {
      ...centerDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.centerSchema.findByIdAndUpdate(id, updateDto, {
      new: true,
    });

    return result;
  }

  public async findCenterById(id: string): Promise<Center> {
    const result = await this.centerSchema
      .findById(id)
      .populate(this.populateDirector, selectProfile, this.profileSchema, {
        isDeleted: false,
      })
      .populate(this.populateAward, selectAward, this.awardSchema, {
        isDeleted: false,
      })
      .populate(this.populateOffice, selectRoom, this.roomSchema, {
        isDeleted: false,
      })
      .exec();
    if (!result) {
      new CommonException(HttpStatusCode.NOT_FOUND, centerMsg.notFound);
    }

    return result;
  }

  public async findAllCenter(
    queryDto: QueryCenterDto,
  ): Promise<{ results: Center[]; total: number }> {
    const { limit, page, searchKey, director } = queryDto;
    const query: IqueryCenter = { isDeleted: false };
    if (director) {
      query.director = new Types.ObjectId(director);
    }
    if (searchKey) {
      query.name = new RegExp(searchKey, 'i');
    }
    const results = await this.centerSchema
      .find(query)
      .skip(limit && page ? Number(limit) * Number(page) - Number(limit) : null)
      .limit(limit ? Number(limit) : null)
      .populate(this.populateDirector, selectProfile, this.profileSchema, {
        isDeleted: false,
      })
      .populate(this.populateAward, selectAward, this.awardSchema, {
        isDeleted: false,
      })
      .populate(this.populateOffice, selectRoom, this.roomSchema, {
        isDeleted: false,
      })
      .sort({ createdAt: -1 })
      .exec();
    const total = await this.centerSchema.find(query).count();

    return { results, total };
  }

  public async deleteCenter(id: string, deletedBy: string): Promise<void> {
    await this.findCenterById(id);
    const dto = {
      isDeleted: true,
      deletedBy,
      deletedAt: Date.now(),
    };
    await this.centerSchema.findByIdAndUpdate(id, dto);
  }
}
