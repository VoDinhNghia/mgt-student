import { Module } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Countries, CountriesSchema } from './schemas/countries.schema';
import { Provinces, ProvinceSchema } from './schemas/countries.province.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Countries.name, schema: CountriesSchema },
      { name: Provinces.name, schema: ProvinceSchema },
    ]),
  ],
  providers: [CountriesService],
  controllers: [CountriesController],
})
export class CountriesModule {}
