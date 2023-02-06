import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  DistrictDocument,
  Districts,
} from '../countries/schemas/countries.district.schema';
import {
  ProvinceDocument,
  Provinces,
} from '../countries/schemas/countries.province.schema';
import {
  Countries,
  CountriesDocument,
} from '../countries/schemas/countries.schema';
import {
  WardDocument,
  Wards,
} from '../countries/schemas/countries.ward.schemas';
import { BranchCreateDto } from './dtos/branch.create.dto';
import { BranchQueryDto } from './dtos/branch.query.dto';
import { BranchUpdateDto } from './dtos/branch.update.dto';
import { Branch, BranchDocument } from './schemas/branch.schema';

@Injectable()
export class BranchService {
  constructor(
    @InjectModel(Branch.name)
    private readonly branchSchema: Model<BranchDocument>,
    @InjectModel(Countries.name)
    private readonly countrySchema: Model<CountriesDocument>,
    @InjectModel(Provinces.name)
    private readonly provinceSchema: Model<ProvinceDocument>,
    @InjectModel(Districts.name)
    private readonly districtSchema: Model<DistrictDocument>,
    @InjectModel(Wards.name)
    private readonly wardSchema: Model<WardDocument>,
  ) {}

  async createBranchNew(branchCreateDto: BranchCreateDto): Promise<Branch> {
    const existedCountry = await this.countrySchema.findById({
      _id: branchCreateDto.location?.country,
    });
    if (!existedCountry) {
      throw new HttpException(
        { statusCode: 404, message: 'Country not found.' },
        404,
      );
    }
    const existedProvince = await this.provinceSchema.findById({
      _id: branchCreateDto.location?.province,
    });
    if (!existedProvince) {
      throw new HttpException(
        { statusCode: 404, message: 'Province not found.' },
        404,
      );
    }
    const existedDistrict = await this.districtSchema.findById({
      _id: branchCreateDto.location?.district,
    });
    if (!existedDistrict) {
      throw new HttpException(
        { statusCode: 404, message: 'District not found.' },
        404,
      );
    }
    const result = await new this.branchSchema(branchCreateDto).save();
    return result;
  }

  async findById(id: string): Promise<Branch> {
    const result = await this.branchSchema
      .findById(id)
      .populate('location.country', '', this.countrySchema)
      .populate('location.province', '', this.provinceSchema)
      .populate('location.district', '', this.districtSchema)
      .populate('location.ward', '', this.wardSchema)
      .exec();
    if (!result) {
      throw new HttpException(
        { statusCode: 404, message: 'Branch not found.' },
        404,
      );
    }

    return result;
  }

  async findAllBranchs(branchQueryDto: BranchQueryDto): Promise<Branch[]> {
    const { limit, page, searchKey } = branchQueryDto;
    let query = {};
    if (searchKey) {
      query = { name: new RegExp(searchKey) };
    }
    const result = await this.branchSchema
      .find(query)
      .skip(Number(limit) * Number(page) - Number(limit))
      .limit(Number(limit))
      .populate('location.country', '', this.countrySchema)
      .populate('location.province', '', this.provinceSchema)
      .populate('location.district', '', this.districtSchema)
      .populate('location.ward', '', this.wardSchema)
      .exec();

    return result;
  }

  async updateBranch(
    id: string,
    branchUpdateDto: BranchUpdateDto,
  ): Promise<void> {
    await this.findById(id);
    await this.branchSchema.findByIdAndUpdate(id, branchUpdateDto);
  }
}
