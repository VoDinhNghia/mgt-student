import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ValidateField } from 'src/validates/validateFieldById';
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
import { BranchController } from './branch.controller';
import { BranchService } from './branch.service';
import { Branch, BranchSchema } from './schemas/branch.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Branch.name, schema: BranchSchema },
      { name: Countries.name, schema: CountriesSchema },
      { name: Provinces.name, schema: ProvinceSchema },
      { name: Districts.name, schema: DistrictSchema },
      { name: Wards.name, schema: WardSchema },
    ]),
  ],
  providers: [BranchService, ValidateField],
  controllers: [BranchController],
})
export class BranchModule {}
