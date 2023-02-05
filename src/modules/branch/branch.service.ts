import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Countries,
  CountriesDocument,
} from '../countries/schemas/countries.schema';
import { BranchCreateDto } from './dtos/branch.create.dto';
import { Branch, BranchDocument } from './schemas/branch.schema';

@Injectable()
export class BranchService {
  constructor(
    @InjectModel(Branch.name)
    private readonly branchSchema: Model<BranchDocument>,
    @InjectModel(Countries.name)
    private readonly countryService: Model<CountriesDocument>,
  ) {}

  async createBranchNew(
    branchCreateDto: BranchCreateDto,
  ): Promise<Branch | any> {
    const result = await new this.branchSchema(branchCreateDto).save();
    return result;
  }

  async findById(id: string): Promise<Branch | any> {
    const result = await this.branchSchema
      .findById(id)
      .populate('location.country', '', this.countryService)
      .exec();
    if (!result) {
      throw new HttpException(
        { statusCode: 404, message: 'Branch not found.' },
        404,
      );
    }

    return result;
  }
}
