import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { schoolId } from 'src/constants/constant';
import { CreateSchoolDto } from './dtos/school.create.dto';
import { UpdateSchoolDto } from './dtos/school.update.dto';
import { School_Info, SchoolInfoDocument } from './schemas/school.schema';
import { ValidateDto } from 'src/validates/validate.common.dto';
import { LookupCommon } from 'src/utils/lookup.query.aggregate-query';

@Injectable()
export class SchoolService {
  constructor(
    @InjectModel(School_Info.name)
    private readonly schoolSchema: Model<SchoolInfoDocument>,
  ) {}

  async validateSchoolDto(schoolDto: Record<string, any>): Promise<void> {
    const { location = {} } = schoolDto;
    const { country, province, district, ward } = location;
    const validate = new ValidateDto();
    if (country) {
      await validate.fieldId('countries', country);
    }
    if (province) {
      await validate.fieldId('province', province);
    }
    if (district) {
      await validate.fieldId('districts', district);
    }
    if (ward) {
      await validate.fieldId('wards', ward);
    }
  }

  async createSchool(schoolDto: CreateSchoolDto): Promise<void> {
    const school = await this.schoolSchema.findOne({ schoolId: schoolId });
    if (!school) {
      await new this.schoolSchema(schoolDto).save();
    }
  }

  async findSchoolById(id: string): Promise<School_Info> {
    const match = { $match: { _id: new Types.ObjectId(id) } };
    const lookup = this.lookupSchool();
    const aggregate = [match, ...lookup];
    const results = await this.schoolSchema.aggregate(aggregate);
    if (!results[0]) {
      new CommonException(404, 'School not found');
    }
    return results[0];
  }

  async updateSchool(
    id: string,
    schoolDto: UpdateSchoolDto,
    updatedBy: string,
  ): Promise<School_Info> {
    const { image = [], award = [] } = schoolDto;
    if (image.length > 0) {
      const imageIds = await new ValidateDto().idLists('attachments', image);
      schoolDto.image = imageIds;
    }
    if (award.length > 0) {
      const awardIds = await new ValidateDto().idLists('awards', award);
      schoolDto.award = awardIds;
    }
    await this.validateSchoolDto(schoolDto);
    const dto = {
      ...schoolDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    await this.schoolSchema.findByIdAndUpdate(id, dto);
    const result = await this.findSchoolById(id);
    return result;
  }

  async findAllSchool(): Promise<School_Info[]> {
    const match = { $match: { isDeleted: false } };
    const lookup = this.lookupSchool();
    const result = await this.schoolSchema.aggregate([match, ...lookup]);
    return result;
  }

  private lookupSchool() {
    const lookup: any = new LookupCommon([
      {
        from: 'attachments',
        localField: 'image',
        foreignField: '_id',
        as: 'image',
        unwind: false,
      },
      {
        from: 'awards',
        localField: 'award',
        foreignField: '_id',
        as: 'award',
        unwind: false,
      },
      {
        from: 'attachments',
        localField: 'policy.attachment',
        foreignField: '_id',
        as: 'attachmentPolicy',
        unwind: false,
      },
      {
        from: 'countries',
        localField: 'location.country',
        foreignField: '_id',
        as: 'country',
        unwind: false,
      },
      {
        from: 'provinces',
        localField: 'location.province',
        foreignField: '_id',
        as: 'province',
        unwind: false,
      },
      {
        from: 'districts',
        localField: 'location.district',
        foreignField: '_id',
        as: 'district',
        unwind: false,
      },
      {
        from: 'wards',
        localField: 'location.ward',
        foreignField: '_id',
        as: 'ward',
        unwind: false,
      },
    ]);
    return lookup;
  }
}
