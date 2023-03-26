import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { CreateCenterDto } from './dtos/centers.create.dto';
import { Center, CenterDocument } from './schemas/centers.schema';
import { UpdateCenterDto } from './dtos/centers.update.dto';
import { ValidateDto } from 'src/validates/validates.common.dto';
import { collections } from 'src/constants/collections.name';
import { msgNotFound } from 'src/constants/message.response';
import { centerLookup } from 'src/utils/utils.lookup.query.service';

@Injectable()
export class CenterService {
  constructor(
    @InjectModel(Center.name)
    private readonly centerSchema: Model<CenterDocument>,
  ) {}

  async createCenter(
    centerDto: CreateCenterDto,
    createdBy: string,
  ): Promise<Center> {
    const { award = [] } = centerDto;
    await new ValidateDto().center(centerDto);
    const validate = new ValidateDto();
    if (award.length > 0) {
      const awards = await validate.idLists(collections.awards, award);
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
    await new ValidateDto().center(centerDto);
    const validate = new ValidateDto();
    if (award.length > 0) {
      const awards = await validate.idLists(collections.awards, award);
      centerDto.award = awards;
    }
    const dto = {
      ...centerDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.centerSchema.findByIdAndUpdate(id, dto, {
      new: true,
    });
    return result;
  }

  async findCenterById(id: string): Promise<Center> {
    const match = { $match: { _id: new Types.ObjectId(id) } };
    const lookup = centerLookup();
    const aggregate = [match, ...lookup];
    const result = await this.centerSchema.aggregate(aggregate);
    if (!result[0]) {
      new CommonException(404, msgNotFound);
    }
    return result[0];
  }

  async findAllCenter(): Promise<Center[]> {
    const match = { $match: { isDeleted: false } };
    const lookup = centerLookup();
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
}
