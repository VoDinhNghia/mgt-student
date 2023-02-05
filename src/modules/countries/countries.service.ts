import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateCountriesDto } from './dto/countries.update.dto';
import {
  ProvinceDocument,
  Provinces,
} from './schemas/countries.province.schema';
import { Countries, CountriesDocument } from './schemas/countries.schema';

@Injectable()
export class CountriesService {
  constructor(
    @InjectModel(Countries.name)
    private readonly countrySchema: Model<CountriesDocument>,
    @InjectModel(Provinces.name)
    private readonly provinceSchema: Model<ProvinceDocument>,
  ) {}

  async initCountries(data: Record<string, any>[]): Promise<Countries | any> {
    const result = [];
    for (const item of data) {
      try {
        const existed = await this.countrySchema.findOne({
          countryId: item.countryId,
        });
        if (existed) {
          item.status = 'Failed - Country existed already.';
          result.push(item);
          continue;
        }
        await new this.countrySchema(item).save();
        item.status = 'Create country success.';
        result.push(item);
      } catch {
        item.status = 'Failed - System error.';
        result.push(item);
      }
    }
    return result;
  }

  async initProvinces(data: Record<string, any>[]): Promise<Provinces | any> {
    const result = [];
    for (const item of data) {
      try {
        const existedCountry = await this.countrySchema.findById({
          _id: item.countryId,
        });
        if (!existedCountry) {
          item.status = 'Failed - Country not found.';
          result.push(item);
          continue;
        }
        const existed = await this.provinceSchema.findOne({
          name: item?.name?.trim(),
        });
        if (existed) {
          item.status = 'Failed - Province name existed.';
          result.push(item);
          continue;
        }
        await new this.provinceSchema(item).save();
        item.status = 'Create province success.';
        result.push(item);
      } catch {
        item.status = 'Failed - System error.';
        result.push(item);
      }
    }
    return result;
  }

  async findAllCountry(): Promise<Countries[]> {
    const result = await this.countrySchema.find().exec();
    return result;
  }

  async findOneCountry(id: string): Promise<Countries> {
    const result = await this.countrySchema.findById(id).exec();
    return result;
  }

  async updateCountry(
    id: string,
    updateCountriesDto: UpdateCountriesDto,
  ): Promise<Countries> {
    return this.countrySchema.findByIdAndUpdate(id, updateCountriesDto).exec();
  }
}
