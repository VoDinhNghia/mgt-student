import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonException } from 'src/exceptions/execeptions.common-error';
import { schoolId } from 'src/constants/constant';
import { CreateSchoolDto } from './dtos/school.create.dto';
import { UpdateSchoolDto } from './dtos/school.update.dto';
import { SchoolInfo, SchoolInfoDocument } from './schemas/school.schema';
import {
  countriesMsg,
  schoolMsg,
} from 'src/constants/constants.message.response';
import {
  Attachment,
  AttachmentDocument,
} from '../attachments/schemas/attachments.schema';
import { Award, AwardDocument } from '../awards/schemas/awards.schema';
import { selectAttachment } from 'src/utils/utils.populate';
import { ValidFields } from 'src/validates/validates.fields-id-dto';
import {
  Countries,
  CountriesDocument,
} from '../countries/schemas/countries.schema';
import {
  ProvinceDocument,
  Provinces,
} from '../countries/schemas/countries.province.schema';
import {
  DistrictDocument,
  Districts,
} from '../countries/schemas/countries.district.schema';
import {
  WardDocument,
  Wards,
} from '../countries/schemas/countries.ward.schemas';
import { HttpStatusCode } from 'src/constants/constants.http-status';

@Injectable()
export class SchoolService {
  private populateImage: string = 'image';
  private populateAward: string = 'award';
  private populateCountry: string = 'location.country';
  private populateProvince: string = 'location.province';
  private populateDistrict: string = 'location.district';
  private populateWard: string = 'location.ward';

  constructor(
    @InjectModel(SchoolInfo.name)
    private readonly schoolSchema: Model<SchoolInfoDocument>,
    @InjectModel(Attachment.name)
    private readonly attachmentSchema: Model<AttachmentDocument>,
    @InjectModel(Award.name)
    private readonly awardSchema: Model<AwardDocument>,
    @InjectModel(Countries.name)
    private readonly countrySchema: Model<CountriesDocument>,
    @InjectModel(Provinces.name)
    private readonly provinceSchema: Model<ProvinceDocument>,
    @InjectModel(Districts.name)
    private readonly districtSchema: Model<DistrictDocument>,
    @InjectModel(Wards.name)
    private readonly wardSchema: Model<WardDocument>,
  ) {}

  public async createSchool(schoolDto: CreateSchoolDto): Promise<void> {
    const school = await this.schoolSchema.findOne({ schoolId });
    if (!school) {
      await new this.schoolSchema(schoolDto).save();
    }
  }

  public async findSchoolInfo(): Promise<SchoolInfo> {
    const results = await this.schoolSchema
      .findOne({ schoolId })
      .populate(this.populateImage, selectAttachment, this.attachmentSchema, {
        isDeleted: false,
      })
      .populate(this.populateAward, '', this.awardSchema, { isDeleted: false })
      .populate(this.populateCountry, '', this.countrySchema, {
        isDeleted: false,
      })
      .populate(this.populateProvince, '', this.provinceSchema, {
        isDeleted: false,
      })
      .populate(this.populateDistrict, '', this.districtSchema, {
        isDeleted: false,
      })
      .populate(this.populateWard, '', this.wardSchema, {
        isDeleted: false,
      })
      .exec();
    if (!results) {
      new CommonException(HttpStatusCode.NOT_FOUND, schoolMsg.notFound);
    }

    return results;
  }

  public async updateSchool(
    id: string,
    schoolDto: UpdateSchoolDto,
    updatedBy: string,
  ): Promise<SchoolInfo> {
    const { image = [], award = [], location = {} } = schoolDto;
    const { country, province, district, ward } = location;
    const valid = new ValidFields();
    if (image.length > 0) {
      const imageIds = await valid.idList(this.attachmentSchema, image);
      schoolDto.image = imageIds;
    }
    if (award.length > 0) {
      const awardIds = await valid.idList(this.awardSchema, award);
      schoolDto.award = awardIds;
    }
    if (country) {
      await valid.id(this.countrySchema, country, countriesMsg.notfound);
    }
    if (province) {
      await valid.id(
        this.provinceSchema,
        province,
        countriesMsg.notfoundProvince,
      );
    }
    if (district) {
      await valid.id(
        this.districtSchema,
        district,
        countriesMsg.notfoundDistrict,
      );
    }
    if (ward) {
      await valid.id(this.wardSchema, ward, countriesMsg.notfoundWard);
    }
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
}
