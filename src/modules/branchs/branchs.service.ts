import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  branchMsg,
  countriesMsg,
  msgNotFound,
} from 'src/constants/constants.message.response';
import { CommonException } from 'src/exceptions/execeptions.common-error';
import {
  selectCountry,
  selectDistrict,
  selectProvince,
  selectWard,
} from 'src/utils/utils.populate';
import { ValidFields } from 'src/validates/validates.fields-id-dto';
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
import { BranchCreateDto } from './dtos/branchs.create.dto';
import { BranchQueryDto } from './dtos/branchs.query.dto';
import { BranchUpdateDto } from './dtos/branchs.update.dto';
import { IqueryBranchs } from './interfaces/branchs.interface';
import { Branch, BranchDocument } from './schemas/branchs.schema';

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

  async createBranchNew(
    createDto: BranchCreateDto,
    createdBy: string,
  ): Promise<Branch> {
    const {
      location: { country, province, district, ward },
      name,
    } = createDto;
    await this.validateName(name);
    const valid = new ValidFields();
    await valid.id(this.countrySchema, country, countriesMsg.notfound);
    await valid.id(
      this.provinceSchema,
      province,
      countriesMsg.notfoundProvince,
    );
    await valid.id(
      this.districtSchema,
      district,
      countriesMsg.notfoundDistrict,
    );
    if (ward) {
      await valid.id(this.wardSchema, ward, countriesMsg.notfoundWard);
    }
    const result = await new this.branchSchema({
      ...createDto,
      createdBy,
    }).save();

    return result;
  }

  async findById(id: string): Promise<Branch> {
    const result = await this.branchSchema
      .findById(id)
      .populate('location.country', selectCountry, this.countrySchema, {
        isDeleted: false,
      })
      .populate('location.province', selectProvince, this.provinceSchema, {
        isDeleted: false,
      })
      .populate('location.district', selectDistrict, this.districtSchema, {
        isDeleted: false,
      })
      .populate('location.ward', selectWard, this.wardSchema, {
        isDeleted: false,
      })
      .exec();
    if (!result) {
      new CommonException(404, msgNotFound);
    }

    return result;
  }

  async findAllBranchs(
    queryDto: BranchQueryDto,
  ): Promise<{ results: Branch[]; total: number }> {
    const { limit, page, searchKey } = queryDto;
    const query: IqueryBranchs = { isDeleted: false };
    if (searchKey) {
      query.name = new RegExp(searchKey, 'i');
    }
    const results = await this.branchSchema
      .find(query)
      .skip(limit && page ? Number(limit) * Number(page) - Number(limit) : null)
      .limit(limit ? Number(limit) : null)
      .populate('location.country', selectCountry, this.countrySchema, {
        isDeleted: false,
      })
      .populate('location.province', selectProvince, this.provinceSchema, {
        isDeleted: false,
      })
      .populate('location.district', selectDistrict, this.districtSchema, {
        isDeleted: false,
      })
      .populate('location.ward', selectWard, this.wardSchema, {
        isDeleted: false,
      })
      .exec();
    const total = await this.branchSchema.find(query).count();
    return { results, total };
  }

  async updateBranch(
    id: string,
    updateDto: BranchUpdateDto,
    updatedBy: string,
  ): Promise<Branch> {
    const {
      location: { country, province, district, ward },
      name,
    } = updateDto;
    if (name) {
      await this.validateName(name);
    }
    const valid = new ValidFields();
    if (country) {
      await valid.id(this.countrySchema, country, countriesMsg.notfound);
    }
    if (province) {
      await valid.id(
        this.provinceSchema,
        province,
        countriesMsg.notfoundProvince,
      );
    }
    if (district) {
      await valid.id(
        this.districtSchema,
        district,
        countriesMsg.notfoundDistrict,
      );
    }
    if (ward) {
      await valid.id(this.wardSchema, ward, countriesMsg.notfoundWard);
    }
    const newDto = {
      ...updateDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.branchSchema.findByIdAndUpdate(id, newDto, {
      new: true,
    });
    return result;
  }

  async deleteBranch(id: string, deletedBy: string): Promise<void> {
    const deleteDto = {
      isDeleted: true,
      deletedBy,
      deletedAt: Date.now(),
    };
    await this.branchSchema.findByIdAndUpdate(id, deleteDto);
  }

  async validateName(name: string): Promise<void> {
    const options = { name: name?.trim() };
    const existed = await this.branchSchema.findOne(options);
    if (existed) {
      new CommonException(409, branchMsg.existedName);
    }
  }
}
