import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonException } from 'src/abstracts/execeptionError';
import { ValidateField } from 'src/abstracts/validateFieldById';
import { schoolId } from 'src/commons/constants';
import {
  Attachment,
  AttachmentDocument,
} from '../attachments/schemas/attachments.schema';
import { Award, AwardDocument } from '../awards/schemas/awards.schema';
import {
  DistrictDocument,
  Districts,
} from '../countries/schemas/countries.district.schema';
import {
  ProvinceDocument,
  Provinces,
} from '../countries/schemas/countries.province.schema';
import {
  Countries,
  CountriesDocument,
} from '../countries/schemas/countries.schema';
import {
  WardDocument,
  Wards,
} from '../countries/schemas/countries.ward.schemas';
import { CreateSchoolDto } from './dtos/school.create.dto';
import { SchoolInfo, SchoolInfoDocument } from './schemas/school.schema';

@Injectable()
export class SchoolService {
  constructor(
    @InjectModel(SchoolInfo.name)
    private readonly schoolSchema: Model<SchoolInfoDocument>,
    @InjectModel(Wards.name)
    private readonly wardSchema: Model<WardDocument>,
    @InjectModel(Award.name)
    private readonly awardSchema: Model<AwardDocument>,
    @InjectModel(Attachment.name)
    private readonly attachmentSchema: Model<AttachmentDocument>,
    @InjectModel(Countries.name)
    private readonly countrySchema: Model<CountriesDocument>,
    @InjectModel(Districts.name)
    private readonly districtSchema: Model<DistrictDocument>,
    @InjectModel(Provinces.name)
    private readonly provinceSchema: Model<ProvinceDocument>,
    private readonly validate: ValidateField,
  ) {}

  async createSchool(schoolDto: CreateSchoolDto): Promise<void> {
    const school = await this.findOneSchool({ schoolId: schoolId });
    if (!school) {
      await new this.schoolSchema(schoolDto).save();
    }
  }

  async findOneSchool(options: Record<string, any>): Promise<SchoolInfo> {
    const result = await this.schoolSchema.findOne(options);
    return result;
  }

  async findSchoolById(id: string): Promise<SchoolInfo> {
    const result = await this.schoolSchema
      .findById(id)
      .populate('image', '', this.attachmentSchema)
      .populate('award', '', this.awardSchema)
      .populate('location.country', '', this.countrySchema)
      .populate('location.province', '', this.provinceSchema)
      .populate('location.district', '', this.districtSchema)
      .populate('location.ward', '', this.wardSchema)
      .exec();
    if (!result) {
      new CommonException(404, 'School not found');
    }
    return result;
  }
}
