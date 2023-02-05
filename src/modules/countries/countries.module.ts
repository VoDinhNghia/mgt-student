import { Module } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Countries, CountriesSchema } from './schemas/countries.schema';
import { Provinces, ProvinceSchema } from './schemas/countries.province.schema';
import { Districts, DistrictSchema } from './schemas/countries.district.schema';
import { Wards, WardSchema } from './schemas/countries.ward.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Countries.name, schema: CountriesSchema },
      { name: Provinces.name, schema: ProvinceSchema },
      { name: Districts.name, schema: DistrictSchema },
      { name: Wards.name, schema: WardSchema },
    ]),
  ],
  providers: [CountriesService],
  controllers: [CountriesController],
})
export class CountriesModule {}
