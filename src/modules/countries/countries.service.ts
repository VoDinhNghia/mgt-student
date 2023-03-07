import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { QueryDistrictDto } from './dto/countries.query-district.dto';
import { QueryPovinceDto } from './dto/countries.query-province.dto';
import { UpdateCountriesDto } from './dto/countries.update.dto';
import {
  DistrictDocument,
  Districts,
} from './schemas/countries.district.schema';
import {
  ProvinceDocument,
  Provinces,
} from './schemas/countries.province.schema';
import { Countries, CountriesDocument } from './schemas/countries.schema';
import { WardDocument, Wards } from './schemas/countries.ward.schemas';

@Injectable()
export class CountriesService {
  constructor(
    @InjectModel(Countries.name)
    private readonly countrySchema: Model<CountriesDocument>,
    @InjectModel(Provinces.name)
    private readonly provinceSchema: Model<ProvinceDocument>,
    @InjectModel(Districts.name)
    private readonly districtSchema: Model<DistrictDocument>,
    @InjectModel(Wards.name)
    private readonly wardSchema: Model<WardDocument>,
  ) {}

  async initCountries(data: Record<string, any>[]): Promise<Countries[]> {
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

  async initProvinces(data: Record<string, any>[]): Promise<Provinces[]> {
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

  async initDisTricts(data: Record<string, any>[]): Promise<Districts[]> {
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
        const existedProvince = await this.provinceSchema.findById({
          _id: item.provinceId,
        });
        if (!existedProvince) {
          item.status = 'Failed - Province not found.';
          result.push(item);
          continue;
        }
        const existed = await this.districtSchema.findOne({
          name: item?.name?.trim(),
        });
        if (existed) {
          item.status = 'Failed - District name existed.';
          result.push(item);
          continue;
        }
        await new this.districtSchema(item).save();
        item.status = 'Create District success.';
        result.push(item);
      } catch {
        item.status = 'Failed - System error.';
        result.push(item);
      }
    }
    return result;
  }

  async initWards(data: Record<string, any>[]): Promise<Wards[]> {
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
        const existedProvince = await this.provinceSchema.findById({
          _id: item.provinceId,
        });
        if (!existedProvince) {
          item.status = 'Failed - Province not found.';
          result.push(item);
          continue;
        }
        const existedDistrict = await this.districtSchema.findById({
          _id: item.districtId,
        });
        if (!existedDistrict) {
          item.status = 'Failed - District not found.';
          result.push(item);
          continue;
        }
        const existed = await this.wardSchema.findOne({
          name: item?.name?.trim(),
        });
        if (existed) {
          item.status = 'Failed - Ward name existed.';
          result.push(item);
          continue;
        }
        await new this.wardSchema(item).save();
        item.status = 'Create wards success.';
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

  async findAllProvinces(
    queryPovinceDto: QueryPovinceDto,
  ): Promise<Provinces[]> {
    let query = {};
    if (queryPovinceDto.countryId) {
      query = {
        countryId: new Types.ObjectId(queryPovinceDto.countryId),
      };
    }
    const result = await this.provinceSchema
      .find(query)
      .populate('countryId', '', this.countrySchema)
      .exec();

    return result;
  }

  async findAllDistricts(
    queryPovinceDto: QueryDistrictDto,
  ): Promise<Districts[]> {
    let query = {};
    if (queryPovinceDto.provinceId) {
      query = {
        countryId: new Types.ObjectId(queryPovinceDto.provinceId),
      };
    }
    const result = await this.districtSchema
      .find(query)
      .populate('countryId', '', this.countrySchema)
      .populate('provinceId', '', this.provinceSchema)
      .exec();

    return result;
  }

  async findAllWards(): Promise<Wards[]> {
    const result = await this.wardSchema
      .find()
      .populate('provinceId', '', this.provinceSchema)
      .populate('districtId', '', this.districtSchema)
      .exec();

    return result;
  }

  async findOneCountry(id: string): Promise<Countries> {
    const result = await this.countrySchema.findById(id);
    if (!result) {
      new CommonException(404, `Country not found.`);
    }
    return result;
  }

  async updateCountry(
    id: string,
    updateCountriesDto: UpdateCountriesDto,
  ): Promise<Countries> {
    await this.findOneCountry(id);
    return this.countrySchema.findByIdAndUpdate(id, updateCountriesDto).exec();
  }
}
