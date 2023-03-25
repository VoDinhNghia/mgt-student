import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { msgNotFound } from 'src/constants/message.response';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { LookupService } from 'src/utils/lookup.query.service';
import { ValidateDto } from 'src/validates/validate.common.dto';
import { CreateUnionDto } from './dtos/unions.create.dto';
import { UpdateUnionDto } from './dtos/unions.update.dto';
import { Union, UnionDocument } from './schemas/unions.schema';

@Injectable()
export class UnionsService {
  constructor(
    @InjectModel(Union.name) private readonly unionSchema: Model<UnionDocument>,
  ) {}

  async createUnion(
    unionDto: CreateUnionDto,
    createdBy: string,
  ): Promise<Union> {
    const newDto = await new ValidateDto().union(unionDto);
    const union = await new this.unionSchema({ ...newDto, createdBy }).save();
    const result = await this.findUnionById(union._id);
    return result;
  }

  async findUnionById(id: string): Promise<Union> {
    const match = { $match: { _id: new Types.ObjectId(id) } };
    const lookup = new LookupService().union();
    const aggregate = [match, ...lookup];
    const result = await this.unionSchema.aggregate(aggregate);
    if (!result[0]) {
      new CommonException(404, msgNotFound);
    }
    return result[0];
  }

  async updateUnion(
    id: string,
    unionDto: CreateUnionDto,
    updatedBy: string,
  ): Promise<Union> {
    const validateDto = await new ValidateDto().union(unionDto);
    const updateDto = {
      ...validateDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.unionSchema.findByIdAndUpdate(id, updateDto, {
      new: true,
    });
    return result;
  }

  async deleteUnion(id: string, deletedBy: string): Promise<void> {
    const deleteDto = {
      deletedBy,
      isDeleted: true,
      deletedAt: Date.now(),
    };
    await this.findUnionById(id);
    await this.unionSchema.findByIdAndUpdate(id, deleteDto);
  }

  async findAllUnions(): Promise<Union[]> {
    const match = { $match: { isDeleted: false } };
    const lookup = new LookupService().union(); // check again
    const aggregate = [match, ...lookup];
    const results = await this.unionSchema.aggregate(aggregate);
    return results;
  }
}
