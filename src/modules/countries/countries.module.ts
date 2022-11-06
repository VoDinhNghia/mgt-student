import { Module } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Countries, CountriesSchema } from './schemas/countries.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Countries.name, schema: CountriesSchema }])],
  providers: [CountriesService],
  controllers: [CountriesController]
})
export class CountriesModule {}
