import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ValidateField } from 'src/abstracts/validateFieldById';
import {
  Attachment,
  AttachmentlSchema,
} from '../attachments/schemas/attachments.schema';
import { Award, AwardSchema } from '../awards/schemas/awards.schema';
import {
  Districts,
  DistrictSchema,
} from '../countries/schemas/countries.district.schema';
import {
  Provinces,
  ProvinceSchema,
} from '../countries/schemas/countries.province.schema';
import {
  Countries,
  CountriesSchema,
} from '../countries/schemas/countries.schema';
import { Wards, WardSchema } from '../countries/schemas/countries.ward.schemas';
import { SchoolInfo, SchoolSchema } from './schemas/school.schema';
import { SchoolController } from './school.controller';
import { SchoolService } from './school.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SchoolInfo.name, schema: SchoolSchema },
      { name: Award.name, schema: AwardSchema },
      { name: Attachment.name, schema: AttachmentlSchema },
      { name: Countries.name, schema: CountriesSchema },
      { name: Provinces.name, schema: ProvinceSchema },
      { name: Districts.name, schema: DistrictSchema },
      { name: Wards.name, schema: WardSchema },
    ]),
  ],
  controllers: [SchoolController],
  providers: [SchoolService, ValidateField],
})
export class SchoolModule {}
