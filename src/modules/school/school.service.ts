import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommonException } from 'src/exceptions/execeptions.common-error';
import { schoolId } from 'src/constants/constant';
import { CreateSchoolDto } from './dtos/school.create.dto';
import { UpdateSchoolDto } from './dtos/school.update.dto';
import { SchoolInfo, SchoolInfoDocument } from './schemas/school.schema';
import { ValidateDto } from 'src/validates/validates.common.dto';
import { collections } from 'src/constants/constants.collections.name';
import { msgNotFound } from 'src/constants/constants.message.response';
import { schoolLookup } from 'src/utils/utils.lookup.query.service';

@Injectable()
export class SchoolService {
  constructor(
    @InjectModel(SchoolInfo.name)
    private readonly schoolSchema: Model<SchoolInfoDocument>,
  ) {}

  async createSchool(schoolDto: CreateSchoolDto): Promise<void> {
    const school = await this.schoolSchema.findOne({ schoolId: schoolId });
    if (!school) {
      await new this.schoolSchema(schoolDto).save();
    }
  }

  async findSchoolById(id: string): Promise<SchoolInfo> {
    const match = { $match: { _id: new Types.ObjectId(id) } };
    const lookup = schoolLookup();
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
  ): Promise<SchoolInfo> {
    const { image = [], award = [] } = schoolDto;
    const validate = new ValidateDto();
    if (image.length > 0) {
      const imageIds = await new ValidateDto().idLists(
        collections.attachments,
        image,
      );
      schoolDto.image = imageIds;
    }
    if (award.length > 0) {
      const awardIds = await validate.idLists(collections.awards, award);
      schoolDto.award = awardIds;
    }
    await validate.school(schoolDto);
    const dto = {
      ...schoolDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.schoolSchema.findByIdAndUpdate(id, dto, {
      new: true,
    });
    return result;
  }

  async findAllSchool(): Promise<SchoolInfo[]> {
    const match = { $match: { isDeleted: false } };
    const lookup = schoolLookup();
    const result = await this.schoolSchema.aggregate([match, ...lookup]);
    return result;
  }
}
