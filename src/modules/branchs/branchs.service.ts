import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { LookupCommon } from 'src/utils/lookup.query.aggregate-query';
import { Pagination } from 'src/utils/page.pagination';
import { ValidateDto } from 'src/validates/validate.common.dto';
import { BranchCreateDto } from './dtos/branchs.create.dto';
import { BranchQueryDto } from './dtos/branchs.query.dto';
import { BranchUpdateDto } from './dtos/branchs.update.dto';
import { Branch, BranchDocument } from './schemas/branchs.schema';

@Injectable()
export class BranchService {
  constructor(
    @InjectModel(Branch.name)
    private readonly branchSchema: Model<BranchDocument>,
  ) {}

  async createBranchNew(branchCreateDto: BranchCreateDto): Promise<Branch> {
    const { country, province, district, ward } = branchCreateDto?.location;
    const validate = new ValidateDto();
    await validate.fieldId('countries', country);
    await validate.fieldId('provinces', province);
    await validate.fieldId('districts', district);
    if (ward) {
      await validate.fieldId('wards', ward);
    }
    const options = { name: branchCreateDto?.name?.trim() };
    await validate.existedByOptions('branchs', options, 'Branch name');
    const result = await new this.branchSchema(branchCreateDto).save();

    return result;
  }

  async findById(id: string): Promise<Branch> {
    const match: Record<string, any> = {
      $match: { id: new Types.ObjectId(id) },
    };
    const lookup = this.lookupCommon();
    const aggregate = [match, ...lookup];
    const result = await this.branchSchema.aggregate(aggregate);
    if (!result[0]) {
      new CommonException(404, `Branch not found.`);
    }

    return result[0];
  }

  async findAllBranchs(branchQueryDto: BranchQueryDto): Promise<Branch[]> {
    const { limit, page, searchKey } = branchQueryDto;
    const match: Record<string, any> = { $match: {} };
    if (searchKey) {
      match.$match.name = new RegExp(searchKey);
    }
    const lookup = this.lookupCommon();
    const aggregatePag: any = new Pagination(limit, page, [match]);
    const aggregate = [...aggregatePag, ...lookup];
    const result = await this.branchSchema.aggregate(aggregate);

    return result;
  }

  async updateBranch(
    id: string,
    branchUpdateDto: BranchUpdateDto,
  ): Promise<void> {
    await this.findById(id);
    await this.branchSchema.findByIdAndUpdate(id, branchUpdateDto);
  }

  lookupCommon() {
    const lookup: any = new LookupCommon([
      {
        from: 'countries',
        localField: 'location.country',
        foreignField: '_id',
        as: 'country',
        unwind: true,
      },
      {
        from: 'provinces',
        localField: 'location.province',
        foreignField: '_id',
        as: 'province',
        unwind: true,
      },
      {
        from: 'districts',
        localField: 'location.district',
        foreignField: '_id',
        as: 'district',
        unwind: true,
      },
      {
        from: 'wards',
        localField: 'location.ward',
        foreignField: '_id',
        as: 'ward',
        unwind: true,
      },
    ]);
    return lookup;
  }
}
