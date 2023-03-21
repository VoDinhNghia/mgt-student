import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { CreateCenterDto } from './dtos/centers.create.dto';
import { Center, CenterDocument } from './schemas/centers.schema';
import { UpdateCenterDto } from './dtos/centers.update.dto';
import { ValidateDto } from 'src/validates/validate.common.dto';
import { LookupCommon } from 'src/utils/lookup.query.aggregate-query';
import { collectionNames } from 'src/constants/constant';

@Injectable()
export class CenterService {
  constructor(
    @InjectModel(Center.name)
    private readonly centerSchema: Model<CenterDocument>,
  ) {}

  async validateCenterDto(centerDto: CreateCenterDto): Promise<void> {
    const { director, contacts } = centerDto;
    const { office } = contacts;
    const validate = new ValidateDto();
    if (director) {
      await validate.fieldId(collectionNames.profiles, director);
    }
    if (office) {
      await validate.fieldId(collectionNames.rooms, office);
    }
  }

  async createCenter(
    centerDto: CreateCenterDto,
    createdBy: string,
  ): Promise<Center> {
    const { award = [] } = centerDto;
    await this.validateCenterDto(centerDto);
    const validate = new ValidateDto();
    if (award.length > 0) {
      const awards = await validate.idLists(collectionNames.awards, award);
      centerDto.award = awards;
    }
    const results = await new this.centerSchema({
      ...centerDto,
      createdBy,
    }).save();
    return results;
  }

  async updateCenter(
    id: string,
    centerDto: UpdateCenterDto,
    updatedBy: string,
  ): Promise<Center> {
    const { award = [] } = centerDto;
    await this.validateCenterDto(centerDto);
    const validate = new ValidateDto();
    if (award.length > 0) {
      const awards = await validate.idLists(collectionNames.awards, award);
      centerDto.award = awards;
    }
    const dto = {
      ...centerDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    await this.centerSchema.findByIdAndUpdate(id, dto);
    const results = await this.findCenterById(id);
    return results;
  }

  async findCenterById(id: string): Promise<Center> {
    const match = { $match: { _id: new Types.ObjectId(id) } };
    const lookup = this.lookupCenter();
    const aggregate = [match, ...lookup];
    const result = await this.centerSchema.aggregate(aggregate);
    if (!result[0]) {
      new CommonException(404, 'Center not found.');
    }
    return result[0];
  }

  async findAllCenter(): Promise<Center[]> {
    const match = { $match: { isDeleted: false } };
    const lookup = this.lookupCenter();
    const aggregate = [match, ...lookup];
    const results = await this.centerSchema.aggregate(aggregate);
    return results;
  }

  async deleteCenter(id: string, deletedBy: string): Promise<void> {
    await this.findCenterById(id);
    const dto = {
      isDeleted: true,
      deletedBy,
      deletedAt: Date.now(),
    };
    await this.centerSchema.findByIdAndUpdate(id, dto);
  }

  private lookupCenter() {
    const lookup: any = new LookupCommon([
      {
        from: collectionNames.profiles,
        localField: 'director',
        foreignField: '_id',
        as: 'director',
        unwind: true,
      },
      {
        from: collectionNames.awards,
        localField: 'award',
        foreignField: '_id',
        as: 'award',
        unwind: false,
      },
      {
        from: collectionNames.rooms,
        localField: 'contacts.office',
        foreignField: '_id',
        as: 'office',
        unwind: true,
      },
    ]);
    return lookup;
  }
}
