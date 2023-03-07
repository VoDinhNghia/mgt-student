import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { CreateDegreeLevelDto } from './dtos/degreelevel.create.dto';
import { UpdateDegreeLevelDto } from './dtos/degreeLevel.update.dto';
import { DegreeLevel, DegreeLevelDocument } from './schemas/degreelevel.schema';

@Injectable()
export class DegreelevelService {
  constructor(
    @InjectModel(DegreeLevel.name)
    private readonly degreeLevelSchema: Model<DegreeLevelDocument>,
  ) {}

  async validateDegreeLevel(
    degreeLevelDto: Record<string, any>,
  ): Promise<void> {
    const { name = '' } = degreeLevelDto;
    const result = await this.degreeLevelSchema.findOne({
      name: name.trim(),
    });
    if (result) {
      new CommonException(409, 'DegreeLevel existed already.');
    }
  }

  async createDegreeLevel(
    degreelevelDto: CreateDegreeLevelDto,
  ): Promise<DegreeLevel> {
    await this.validateDegreeLevel(degreelevelDto);
    const result = await new this.degreeLevelSchema(degreelevelDto).save();
    return result;
  }

  async findDegreeLevelById(id: string): Promise<DegreeLevel> {
    const result = await this.degreeLevelSchema.findById(id);
    if (!result) {
      new CommonException(404, 'DegreeLevel not found.');
    }
    return result;
  }

  async updateDegreeLevel(
    id: string,
    updateDto: UpdateDegreeLevelDto,
  ): Promise<DegreeLevel> {
    const result = await this.degreeLevelSchema.findById(id);
    if (!result) {
      new CommonException(404, 'DegreeLevel not found.');
    }
    await this.validateDegreeLevel(updateDto);
    result.name = updateDto.name || result.name;
    result.description = updateDto.description || result.description;
    await result.save();
    return result;
  }

  async findAllDegreeLevel(): Promise<DegreeLevel[]> {
    const results = await this.degreeLevelSchema.find({});
    return results;
  }
}
