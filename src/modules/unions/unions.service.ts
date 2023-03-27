import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { msgNotFound } from 'src/constants/constants.message.response';
import { CommonException } from 'src/exceptions/execeptions.common-error';
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
    const union = await new this.unionSchema({ ...unionDto, createdBy }).save();
    return union;
  }

  async findUnionById(id: string): Promise<Union> {
    const result = await this.unionSchema.findById(id);
    if (!result) {
      new CommonException(404, msgNotFound);
    }
    return result;
  }

  async updateUnion(
    id: string,
    unionDto: UpdateUnionDto,
    updatedBy: string,
  ): Promise<Union> {
    const updateDto = {
      ...unionDto,
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
    const results = await this.unionSchema.find({ isDeleted: false });
    return results;
  }
}
