import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ValidateField } from 'src/abstracts/validateFieldById';
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
}
