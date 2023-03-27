import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { msgNotFound } from 'src/constants/constants.message.response';
import { CommonException } from 'src/exceptions/execeptions.common-error';
import { CreateCoutriesDto } from './dto/countries.create.dto';
import { CreateDistrictDto } from './dto/countries.create.district.dto';
import { CreateProvinceDto } from './dto/countries.create.province.dto';
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
import { CreateWardDto } from './dto/countries.create.ward.dto';

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

  async initCountries(data: CreateCoutriesDto[]) {
    for await (const item of data) {
      try {
        const existed = await this.countrySchema.findOne({
          countryId: item.countryId,
        });
        if (existed) {
          item.status = 'Failed - Country existed already.';
          continue;
        }
        await new this.countrySchema(item).save();
        item.status = 'Create country success.';
      } catch {
        item.status = 'Failed - System error.';
      }
    }
    return data;
  }

  async initProvinces(data: CreateProvinceDto[]) {
    for await (const item of data) {
      try {
        const existedCountry = await this.countrySchema.findById({
          _id: item.countryId,
        });
        if (!existedCountry) {
          item.status = 'Failed - Country not found.';
          continue;
        }
        const existed = await this.provinceSchema.findOne({
          name: item?.name?.trim(),
        });
        if (existed) {
          item.status = 'Failed - Province name existed.';
          continue;
        }
        await new this.provinceSchema(item).save();
        item.status = 'Create province success.';
      } catch {
        item.status = 'Failed - System error.';
      }
    }
    return data;
  }

  async initDisTricts(data: CreateDistrictDto[]) {
    for await (const item of data) {
      try {
        const existedCountry = await this.countrySchema.findById({
          _id: item.countryId,
        });
        if (!existedCountry) {
          item.status = 'Failed - Country not found.';
          continue;
        }
        const existedProvince = await this.provinceSchema.findById({
          _id: item.provinceId,
        });
        if (!existedProvince) {
          item.status = 'Failed - Province not found.';
          continue;
        }
        const existed = await this.districtSchema.findOne({
          name: item?.name?.trim(),
        });
        if (existed) {
          item.status = 'Failed - District name existed.';
          continue;
        }
        await new this.districtSchema(item).save();
        item.status = 'Create District success.';
      } catch {
        item.status = 'Failed - System error.';
      }
    }
    return data;
  }

  async initWards(data: CreateWardDto[]) {
    for await (const item of data) {
      try {
        const existedCountry = await this.countrySchema.findById({
          _id: item.countryId,
        });
        if (!existedCountry) {
          item.status = 'Failed - Country not found.';
          continue;
        }
        const existedProvince = await this.provinceSchema.findById({
          _id: item.provinceId,
        });
        if (!existedProvince) {
          item.status = 'Failed - Province not found.';
          continue;
        }
        const existedDistrict = await this.districtSchema.findById({
          _id: item.districtId,
        });
        if (!existedDistrict) {
          item.status = 'Failed - District not found.';
          continue;
        }
        const existed = await this.wardSchema.findOne({
          name: item?.name?.trim(),
        });
        if (existed) {
          item.status = 'Failed - Ward name existed.';
          continue;
        }
        await new this.wardSchema(item).save();
        item.status = 'Create wards success.';
      } catch {
        item.status = 'Failed - System error.';
      }
    }
    return data;
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
      new CommonException(404, msgNotFound);
    }
    return result;
  }

  async updateCountry(
    id: string,
    updateCountriesDto: UpdateCountriesDto,
  ): Promise<Countries> {
    await this.findOneCountry(id);
    const result = await this.countrySchema.findByIdAndUpdate(
      id,
      updateCountriesDto,
      { new: true },
    );
    return result;
  }
}
