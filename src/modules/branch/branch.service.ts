import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonException } from 'src/exceptions/execeptionError';
import { ValidateField } from 'src/validates/validateFieldById';
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
    private readonly validateField: ValidateField,
  ) {}

  async createBranchNew(branchCreateDto: BranchCreateDto): Promise<Branch> {
    const { country, province, district } = branchCreateDto?.location;
    await this.validateField.byId(this.countrySchema, country, 'Country');
    await this.validateField.byId(this.provinceSchema, province, 'Province');
    await this.validateField.byId(this.districtSchema, district, 'District');
    const options = { name: branchCreateDto?.name?.trim() };
    await this.validateField.existed(this.branchSchema, options, 'Branch name');
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
      new CommonException(404, `Branch not found.`);
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
