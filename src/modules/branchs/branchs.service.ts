import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { collections } from 'src/constants/collections.name';
import { msgNotFound } from 'src/constants/message.response';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { branchLookup } from 'src/utils/lookup.query.service';
import { QueryPagination } from 'src/utils/page.pagination';
import { ValidateDto } from 'src/validates/validate.common.dto';
import { BranchCreateDto } from './dtos/branchs.create.dto';
import { BranchQueryDto } from './dtos/branchs.query.dto';
import { BranchUpdateDto } from './dtos/branchs.update.dto';
import { ImatchFindBranch } from './interfaces/branchs.match.find';
import { Branch, BranchDocument } from './schemas/branchs.schema';

@Injectable()
export class BranchService {
  constructor(
    @InjectModel(Branch.name)
    private readonly branchSchema: Model<BranchDocument>,
  ) {}

  async createBranchNew(
    branchCreateDto: BranchCreateDto,
    createdBy: string,
  ): Promise<Branch> {
    const { country, province, district, ward } = branchCreateDto?.location;
    const validate = new ValidateDto();
    await validate.fieldId(collections.countries, country);
    await validate.fieldId(collections.provinces, province);
    await validate.fieldId(collections.districts, district);
    if (ward) {
      await validate.fieldId(collections.wards, ward);
    }
    const options = { name: branchCreateDto?.name?.trim() };
    await validate.existedByOptions(
      collections.branches,
      options,
      'Branch name',
    );
    const result = await new this.branchSchema({
      ...branchCreateDto,
      createdBy,
    }).save();

    return result;
  }

  async findById(id: string): Promise<Branch> {
    const match: ImatchFindBranch = {
      $match: { _id: new Types.ObjectId(id) },
    };
    const lookup = branchLookup();
    const aggregate = [match, ...lookup];
    const result = await this.branchSchema.aggregate(aggregate);
    if (!result[0]) {
      new CommonException(404, msgNotFound);
    }

    return result[0];
  }

  async findAllBranchs(branchQueryDto: BranchQueryDto): Promise<Branch[]> {
    const { limit, page, searchKey } = branchQueryDto;
    const match: ImatchFindBranch = { $match: { isDeleted: false } };
    if (searchKey) {
      match.$match.name = new RegExp(searchKey);
    }
    const lookup = branchLookup();
    const aggregatePag = new QueryPagination().skipLimitAndSort(limit, page);
    const aggregate = [match, ...aggregatePag, ...lookup];
    const result = await this.branchSchema.aggregate(aggregate);

    return result;
  }

  async updateBranch(
    id: string,
    branchUpdateDto: BranchUpdateDto,
    updatedBy: string,
  ): Promise<Branch> {
    await this.findById(id);
    const dto = {
      ...branchUpdateDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.branchSchema.findByIdAndUpdate(id, dto, {
      new: true,
    });
    return result;
  }
}
