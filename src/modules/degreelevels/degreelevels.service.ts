import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { degreeLevelMsg } from 'src/constants/constants.message.response';
import { CommonException } from 'src/exceptions/execeptions.common-error';
import { CreateDegreeLevelDto } from './dtos/degreelevels.create.dto';
import { QueryDegreeLevelDto } from './dtos/degreelevels.query.dto';
import { UpdateDegreeLevelDto } from './dtos/degreeLevels.update.dto';
import { IqueryDegreelevel } from './interfaces/degreelevels.interface';
import {
  DegreeLevel,
  DegreeLevelDocument,
} from './schemas/degreelevels.schema';
import { HttpStatusCode } from 'src/constants/constants.http-status';

@Injectable()
export class DegreelevelService {
  constructor(
    @InjectModel(DegreeLevel.name)
    private readonly degreeLevelSchema: Model<DegreeLevelDocument>,
  ) {}

  async createDegreeLevel(
    degreelevelDto: CreateDegreeLevelDto,
    createdBy: string,
  ): Promise<DegreeLevel> {
    const { name } = degreelevelDto;
    await this.validateName(name);
    const result = await new this.degreeLevelSchema({
      ...degreelevelDto,
      createdBy,
    }).save();
    return result;
  }

  async findDegreeLevelById(id: string): Promise<DegreeLevel> {
    const result = await this.degreeLevelSchema.findById(id);
    if (!result) {
      new CommonException(HttpStatusCode.NOT_FOUND, degreeLevelMsg.notFound);
    }
    return result;
  }

  async updateDegreeLevel(
    id: string,
    updateDto: UpdateDegreeLevelDto,
    updatedBy: string,
  ): Promise<DegreeLevel> {
    const { name } = updateDto;
    if (name) {
      await this.validateName(name);
    }
    const dto = {
      ...updateDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.degreeLevelSchema.findByIdAndUpdate(id, dto, {
      new: true,
    });
    return result;
  }

  async findAllDegreeLevels(
    queryDto: QueryDegreeLevelDto,
  ): Promise<{ results: DegreeLevel[]; total: number }> {
    const { limit, page, searchKey } = queryDto;
    const query: IqueryDegreelevel = { isDeleted: false };
    if (searchKey) {
      query.name = new RegExp(searchKey, 'i');
    }
    const results = await this.degreeLevelSchema
      .find(query)
      .skip(limit && page ? Number(limit) * Number(page) - Number(limit) : null)
      .limit(limit ? Number(limit) : null)
      .sort({ createdAt: -1 })
      .exec();
    const total = await this.degreeLevelSchema.find(query).count();
    return { results, total };
  }

  async deleteDegreelevel(id: string, deletedBy: string): Promise<void> {
    await this.findDegreeLevelById(id);
    const deleteDto = {
      deletedBy,
      isDeleted: true,
      deletedAt: Date.now(),
    };
    await this.degreeLevelSchema.findByIdAndUpdate(id, deleteDto);
  }

  async validateName(name: string): Promise<void> {
    const result = await this.degreeLevelSchema.findOne({
      name: name.trim(),
      isDeleted: false,
    });
    if (result) {
      new CommonException(HttpStatusCode.CONFLICT, degreeLevelMsg.existedName);
    }
  }
}
