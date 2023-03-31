import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
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
import { BranchController } from './branchs.controller';
import { BranchService } from './branchs.service';
import { Branch, BranchSchema } from './schemas/branchs.schema';

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
  providers: [BranchService],
  controllers: [BranchController],
})
export class BranchModule {}
