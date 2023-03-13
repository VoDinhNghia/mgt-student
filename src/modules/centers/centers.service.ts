import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { CreateCenterDto } from './dtos/centers.create.dto';
import { Center, CenterDocument } from './schemas/centers.schema';
import { UpdateCenterDto } from './dtos/centers.update.dto';
import { ValidateDto } from 'src/validates/validate.common.dto';
import { LookupCommon } from 'src/utils/lookup.query.aggregate-query';

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
      await validate.fieldId('profiles', director);
    }
    if (office) {
      await validate.fieldId('rooms', office);
    }
  }

  async createCenter(centerDto: CreateCenterDto): Promise<Center> {
    const { award = [] } = centerDto;
    await this.validateCenterDto(centerDto);
    const validate = new ValidateDto();
    if (award.length > 0) {
      const awards = await validate.idLists('awards', award);
      centerDto.award = awards;
    }
    const results = await new this.centerSchema(centerDto).save();
    return results;
  }

  async updateCenter(id: string, centerDto: UpdateCenterDto): Promise<Center> {
    const { award = [] } = centerDto;
    await this.validateCenterDto(centerDto);
    const validate = new ValidateDto();
    if (award.length > 0) {
      const awards = await validate.idLists('awards', award);
      centerDto.award = awards;
    }
    await this.centerSchema.findByIdAndUpdate(id);
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
    const lookup = this.lookupCenter();
    const results = await this.centerSchema.aggregate(lookup);
    return results;
  }

  async deleteCenter(id: string): Promise<void> {
    await this.findCenterById(id);
    await this.centerSchema.findByIdAndDelete(id);
  }

  private lookupCenter() {
    const lookup: any = new LookupCommon([
      {
        from: 'profiles',
        localField: 'director',
        foreignField: '_id',
        as: 'director',
        unwind: true,
      },
      {
        from: 'awards',
        localField: 'award',
        foreignField: '_id',
        as: 'award',
        unwind: false,
      },
      {
        from: 'rooms',
        localField: 'contacts.office',
        foreignField: '_id',
        as: 'office',
        unwind: true,
      },
    ]);
    return lookup;
  }
}
