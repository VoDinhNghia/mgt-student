import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonException } from 'src/exceptions/execeptionError';
import { ValidateField } from 'src/validates/validateFieldById';
import { schoolId } from 'src/constants/constant';
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
import { UpdateSchoolDto } from './dtos/school.update.dto';
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

  async validateFieldSchoolDto(schoolDto: Record<string, any>): Promise<void> {
    const { image = [], award = [], location = {} } = schoolDto;
    const { country, province, district, ward } = location;
    if (image.length > 0) {
      for (const item of image) {
        await this.validate.byId(
          this.attachmentSchema,
          item,
          `Attachment ${item}`,
        );
      }
    }
    if (award.length > 0) {
      for (const item of award) {
        await this.validate.byId(this.awardSchema, item, `Award ${item}`);
      }
    }
    if (country) {
      await this.validate.byId(this.countrySchema, country, `Country`);
    }
    if (province) {
      await this.validate.byId(this.provinceSchema, province, `Province`);
    }
    if (district) {
      await this.validate.byId(this.districtSchema, district, `District`);
    }
    if (ward) {
      await this.validate.byId(this.wardSchema, ward, `Ward`);
    }
  }

  async createSchool(schoolDto: CreateSchoolDto): Promise<void> {
    const school = await this.schoolSchema.findOne({ schoolId: schoolId });
    if (!school) {
      await new this.schoolSchema(schoolDto).save();
    }
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

  async updateSchool(
    id: string,
    schoolDto: UpdateSchoolDto,
  ): Promise<SchoolInfo> {
    await this.validateFieldSchoolDto(schoolDto);
    await this.schoolSchema.findByIdAndUpdate(id, schoolDto);
    const result = await this.findSchoolById(id);
    return result;
  }

  async findAllSchool(): Promise<SchoolInfo[]> {
    const result = await this.schoolSchema
      .find()
      .populate('image', '', this.attachmentSchema)
      .populate('award', '', this.awardSchema)
      .populate('location.country', '', this.countrySchema)
      .populate('location.province', '', this.provinceSchema)
      .populate('location.district', '', this.districtSchema)
      .populate('location.ward', '', this.wardSchema)
      .exec();
    return result;
  }
}
