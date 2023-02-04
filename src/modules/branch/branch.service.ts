import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BranchCreateDto } from './dtos/branch.create.dto';
import { Branch, BranchDocument } from './schemas/branch.schema';

@Injectable()
export class BranchService {
  constructor(
    @InjectModel(Branch.name)
    private readonly branchSchema: Model<BranchDocument>,
  ) {}

  async createBranchNew(branchCreateDto: BranchCreateDto) {
    try {
      const result = await new this.branchSchema(branchCreateDto).save();
      return result;
    } catch {
      throw new HttpException(
        { statusCode: 500, message: 'Server error' },
        500,
      );
    }
  }
}
