import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  countriesMsg,
  msgNotFound,
} from 'src/constants/constants.message.response';
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
import { collections } from 'src/constants/constants.collections.name';
import { QueryCountriesDto } from './dto/countries.query.dto';
import {
  IqueryCountries,
  IqueryDistricts,
  IqueryProvinces,
  IqueryWards,
} from './interfaces/countries.interface';
import {
  selectCountry,
  selectDistrict,
  selectProvince,
} from 'src/utils/utils.populate';
import { ConfigService } from '@nestjs/config';
import { QueryWardDto } from './dto/countries.query-ward.dto';
import { HttpStatusCode } from 'src/constants/constants.http-status';

@Injectable()
export class CountriesService {
  private populateCountryId: string = 'countryId';
  private populateProvinceId: string = 'provinceId';
  private populateDistrictId: string = 'districtId';
  private prefixUrlFlag: string = 'PREFIX_URL_FLAG';

  constructor(
    @InjectModel(Countries.name)
    private readonly countrySchema: Model<CountriesDocument>,
    @InjectModel(Provinces.name)
    private readonly provinceSchema: Model<ProvinceDocument>,
    @InjectModel(Districts.name)
    private readonly districtSchema: Model<DistrictDocument>,
    @InjectModel(Wards.name)
    private readonly wardSchema: Model<WardDocument>,
    private readonly configService: ConfigService,
  ) {}

  public async initCountries(
    data: CreateCoutriesDto[],
    createdBy: string,
  ): Promise<Countries[]> {
    try {
      await this.countrySchema.db.dropCollection(collections.countries);
      await this.countrySchema.db.dropCollection(collections.provinces);
      await this.countrySchema.db.dropCollection(collections.districts);
      await this.countrySchema.db.dropCollection(collections.wards);
    } catch (error) {
      console.log(error);
    }
    for await (const item of data) {
      const { countryId, name, flag, capital } = item;
      if (!countryId || !name || !flag || !capital) {
        item.status = countriesMsg.invalidFieldsInitCountry;
        continue;
      }
      try {
        item.flag = `${this.configService.get(this.prefixUrlFlag)}${item.flag}`;
        await new this.countrySchema({ ...item, createdBy }).save();
        item.status = countriesMsg.createSuccess;
      } catch {
        item.status = countriesMsg.systemError;
        continue;
      }
    }

    return data;
  }

  public async initProvinces(
    data: CreateProvinceDto[],
    createdBy: string,
  ): Promise<CreateProvinceDto[]> {
    try {
      await this.countrySchema.db.dropCollection(collections.provinces);
      await this.countrySchema.db.dropCollection(collections.districts);
      await this.countrySchema.db.dropCollection(collections.wards);
    } catch (error) {
      console.log(error);
    }
    const countries = await this.countrySchema.find({ isDeleted: false });
    for await (const item of data) {
      try {
        const country = countries.find(
          (cou: Countries) => String(cou.countryId) === String(item.countryId),
        );
        if (!country) {
          item.status = countriesMsg.validCountry;
          continue;
        }
        item.countryId = country._id;
        await new this.provinceSchema({ ...item, createdBy }).save();
        item.status = countriesMsg.createProvinceSuccess;
      } catch {
        item.status = countriesMsg.systemError;
      }
    }

    return data;
  }

  public async initDisTricts(
    data: CreateDistrictDto[],
    createdBy: string,
  ): Promise<CreateDistrictDto[]> {
    try {
      await this.countrySchema.db.dropCollection(collections.districts);
      await this.countrySchema.db.dropCollection(collections.wards);
    } catch (error) {
      console.log(error);
    }
    const countries = await this.countrySchema.find({ isDeleted: false });
    const provinces = await this.provinceSchema.find({ isDeleted: false });
    for await (const item of data) {
      try {
        const country = countries.find(
          (cou: Countries) => String(cou.countryId) === String(item.countryId),
        );
        if (!country) {
          item.status = countriesMsg.validCountry;
          continue;
        }
        const province = provinces.find(
          (pro: Provinces) => String(pro.codename) === String(item.provinceId),
        );
        if (!province) {
          item.status = countriesMsg.validProvince;
          continue;
        }
        item.countryId = country._id;
        item.provinceId = province._id;
        await new this.districtSchema({ ...item, createdBy }).save();
        item.status = countriesMsg.createDistrictSuccess;
      } catch {
        item.status = countriesMsg.systemError;
      }
    }

    return data;
  }

  public async initWards(
    data: CreateWardDto[],
    createdBy: string,
  ): Promise<CreateWardDto[]> {
    try {
      await this.countrySchema.db.dropCollection(collections.wards);
    } catch (error) {
      console.log(error);
    }
    const countries = await this.countrySchema.find({ isDeleted: false });
    const provinces = await this.provinceSchema.find({ isDeleted: false });
    const districts = await this.districtSchema.find({ isDeleted: false });
    for await (const item of data) {
      try {
        const country = countries.find(
          (cou: Countries) => String(cou.countryId) === String(item.countryId),
        );
        if (!country) {
          item.status = countriesMsg.validCountry;
          continue;
        }
        const province = provinces.find(
          (pro: Provinces) => String(pro.codename) === String(item.provinceId),
        );
        if (!province) {
          item.status = countriesMsg.validProvince;
          continue;
        }
        const district = districts.find(
          (dis: Districts) => String(dis.codename) === String(item.districtId),
        );
        if (!district) {
          item.status = countriesMsg.validDistrict;
          continue;
        }
        item.countryId = country._id;
        item.provinceId = province._id;
        item.districtId = district._id;
        await new this.wardSchema({ ...item, createdBy }).save();
        item.status = countriesMsg.createWardSuccess;
      } catch {
        item.status = countriesMsg.systemError;
      }
    }

    return data;
  }

  public async findAllCountry(
    queryDto: QueryCountriesDto,
  ): Promise<{ results: Countries[]; total: number }> {
    const { limit, page, searchKey } = queryDto;
    const query: IqueryCountries = { isDeleted: false };
    if (searchKey) {
      query.name = new RegExp(searchKey, 'i');
    }
    const results = await this.countrySchema
      .find(query)
      .skip(limit && page ? Number(limit) * Number(page) - Number(limit) : null)
      .limit(limit ? Number(limit) : null)
      .sort({ createdAt: -1 })
      .exec();
    const total = await this.countrySchema.find(query).count();

    return { results, total };
  }

  public async findAllProvinces(
    queryPovinceDto: QueryPovinceDto,
  ): Promise<{ results: Provinces[]; total: number }> {
    const { countryId, searchKey, limit, page } = queryPovinceDto;
    const query: IqueryProvinces = { isDeleted: false };
    if (countryId) {
      query.countryId = new Types.ObjectId(countryId);
    }
    if (searchKey) {
      query.name = new RegExp(searchKey, 'i');
    }
    const results = await this.provinceSchema
      .find(query)
      .skip(limit && page ? Number(limit) * Number(page) - Number(limit) : null)
      .limit(limit ? Number(limit) : null)
      .populate(this.populateCountryId, selectCountry, this.countrySchema, {
        isDeleted: false,
      })
      .sort({ createdAt: -1 })
      .exec();
    const total = await this.provinceSchema.find(query).count();

    return { results, total };
  }

  public async findAllDistricts(
    queryDto: QueryDistrictDto,
  ): Promise<{ results: Districts[]; total: number }> {
    const { provinceId, searchKey, limit, page } = queryDto;
    const query: IqueryDistricts = { isDeleted: false };
    if (provinceId) {
      query.provinceId = new Types.ObjectId(provinceId);
    }
    if (searchKey) {
      query.name = new RegExp(searchKey, 'i');
    }
    const results = await this.districtSchema
      .find(query)
      .skip(limit && page ? Number(limit) * Number(page) - Number(limit) : null)
      .limit(limit ? Number(limit) : null)
      .populate(this.populateCountryId, selectCountry, this.countrySchema, {
        isDeleted: false,
      })
      .populate(this.populateProvinceId, selectProvince, this.provinceSchema, {
        isDeleted: false,
      })
      .sort({ createdAt: -1 })
      .exec();
    const total = await this.districtSchema.find(query).count();

    return { results, total };
  }

  public async findAllWards(
    queryDto: QueryWardDto,
  ): Promise<{ results: Wards[]; total: number }> {
    const { districtId, searchKey, limit, page } = queryDto;
    const query: IqueryWards = { isDeleted: false };
    if (districtId) {
      query.districtId = new Types.ObjectId(districtId);
    }
    if (searchKey) {
      query.name = new RegExp(searchKey, 'i');
    }
    const results = await this.wardSchema
      .find(query)
      .skip(limit && page ? Number(limit) * Number(page) - Number(limit) : null)
      .limit(limit ? Number(limit) : null)
      .populate(this.populateCountryId, selectCountry, this.countrySchema, {
        isDeleted: false,
      })
      .populate(this.populateProvinceId, selectProvince, this.provinceSchema, {
        isDeleted: false,
      })
      .populate(this.populateDistrictId, selectDistrict, this.districtSchema, {
        isDeleted: false,
      })
      .sort({ createdAt: -1 })
      .exec();
    const total = await this.wardSchema.find(query).count();

    return { results, total };
  }

  public async findOneCountry(id: string): Promise<Countries> {
    const result = await this.countrySchema.findById(id);
    if (!result) {
      new CommonException(HttpStatusCode.NOT_FOUND, msgNotFound);
    }

    return result;
  }

  public async updateCountry(
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
