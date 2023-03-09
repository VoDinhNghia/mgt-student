import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { Award, AwardDocument } from '../awards/schemas/awards.schema';
import { Rooms, RoomsDocument } from '../rooms/schemas/rooms.schema';
import {
  Profile,
  ProfileDocument,
} from '../users/schemas/users.profile.schema';
import { CreateCenterDto } from './dtos/centers.create.dto';
import { Center, CenterDocument } from './schemas/centers.schema';
import { uniq } from 'lodash';
import { UpdateCenterDto } from './dtos/centers.update.dto';

@Injectable()
export class CenterService {
  constructor(
    @InjectModel(Center.name)
    private readonly centerSchema: Model<CenterDocument>,
    @InjectModel(Award.name)
    private readonly awardSchema: Model<AwardDocument>,
    @InjectModel(Rooms.name)
    private readonly roomSchema: Model<RoomsDocument>,
    @InjectModel(Profile.name)
    private readonly profileSchema: Model<ProfileDocument>,
  ) {}

  // posible move to difference service (manage courses, students, ... of center)
  // currently, only introduction centers of school

  async validateCenterDto(centerDto: CreateCenterDto): Promise<void> {
    const { director, contacts } = centerDto;
    if (director) {
      const directorInfo = await this.profileSchema.findById(director);
      if (!directorInfo) {
        new CommonException(404, 'Director not found.');
      }
    }
    if (contacts.office) {
      const officeInfo = await this.roomSchema.findById(contacts.office);
      if (!officeInfo) {
        new CommonException(404, 'Director not found.');
      }
    }
  }

  async validateAward(award = []): Promise<string[]> {
    const awardIds = [];
    if (award.length === 0) {
      return awardIds;
    }
    const awards = uniq(award);
    for (const item in awards) {
      try {
        awardIds.push(new Types.ObjectId(item));
      } catch (error) {
        console.log(error);
        continue;
      }
    }
    const results = await this.awardSchema.find({ _id: { $in: awards } });
    const idLists = results.map((award: Record<string, any>) => {
      return award._id;
    });
    return idLists;
  }

  async createCenter(centerDto: CreateCenterDto): Promise<Center> {
    const { award } = centerDto;
    await this.validateCenterDto(centerDto);
    if (award) {
      const awards = await this.validateAward(award);
      centerDto.award = awards;
    }
    const results = await new this.centerSchema(centerDto).save();
    return results;
  }

  async updateCenter(id: string, centerDto: UpdateCenterDto): Promise<Center> {
    const { award } = centerDto;
    await this.validateCenterDto(centerDto);
    if (award) {
      const awards = await this.validateAward(award);
      centerDto.award = awards;
    }
    await this.centerSchema.findByIdAndUpdate(id);
    const results = await this.findCenterById(id);
    return results;
  }

  async findCenterById(id: string): Promise<Center> {
    const result = await this.centerSchema
      .findById(id)
      .populate('director', '', this.profileSchema)
      .populate('award', '', this.awardSchema)
      .populate('contacts.office', '', this.roomSchema)
      .exec();
    if (!result) {
      new CommonException(404, 'Center not found.');
    }
    return result;
  }

  async findAllCenter(): Promise<Center[]> {
    const results = await this.centerSchema
      .find({})
      .populate('director', '', this.profileSchema)
      .populate('award', '', this.awardSchema)
      .populate('contacts.office', '', this.roomSchema)
      .exec();
    return results;
  }

  async deleteCenter(id: string): Promise<void> {
    await this.findCenterById(id);
    await this.centerSchema.findByIdAndDelete(id);
  }
}
