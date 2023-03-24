import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { schoolId } from 'src/constants/constant';
import { CreateSchoolDto } from './dtos/school.create.dto';
import { UpdateSchoolDto } from './dtos/school.update.dto';
import { School_Info, SchoolInfoDocument } from './schemas/school.schema';
import { ValidateDto } from 'src/validates/validate.common.dto';
import { collections } from 'src/constants/collections.name';
import { LookupService } from 'src/utils/lookup.query.service';
import { msgNotFound } from 'src/constants/message.response';

@Injectable()
export class SchoolService {
  validate = new ValidateDto();
  constructor(
    @InjectModel(School_Info.name)
    private readonly schoolSchema: Model<SchoolInfoDocument>,
  ) {}

  async validateSchoolDto(schoolDto: Record<string, any>): Promise<void> {
    const { location = {} } = schoolDto;
    const { country, province, district, ward } = location;
    if (country) {
      await this.validate.fieldId(collections.countries, country);
    }
    if (province) {
      await this.validate.fieldId('province', province);
    }
    if (district) {
      await this.validate.fieldId(collections.districts, district);
    }
    if (ward) {
      await this.validate.fieldId(collections.wards, ward);
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
    const lookup = new LookupService().school();
    const aggregate = [match, ...lookup];
    const results = await this.schoolSchema.aggregate(aggregate);
    if (!results[0]) {
      new CommonException(404, msgNotFound);
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
      const imageIds = await this.validate.idLists(
        collections.attachments,
        image,
      );
      schoolDto.image = imageIds;
    }
    if (award.length > 0) {
      const awardIds = await this.validate.idLists(collections.awards, award);
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
    const lookup = new LookupService().school();
    const result = await this.schoolSchema.aggregate([match, ...lookup]);
    return result;
  }
}
