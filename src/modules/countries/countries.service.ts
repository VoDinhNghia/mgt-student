import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCoutriesDto } from './dto/countries.create.dto';
import { UpdateCountriesDto } from './dto/countries.update.dto';
import { Countries, CountriesDocument } from './schemas/countries.schema';

@Injectable()
export class CountriesService {
  constructor(
    @InjectModel(Countries.name)
    private readonly model: Model<CountriesDocument>,
  ) {}

  async findAll(): Promise<Countries[]> {
    const result = await this.model.find().exec();
    return result;
  }

  async findOne(id: string): Promise<Countries> {
    const result = await this.model.findById(id).exec();
    return result;
  }

  async create(createCoutriesDto: CreateCoutriesDto): Promise<Countries> {
    return new this.model({
      ...createCoutriesDto,
      createdAt: new Date(),
    }).save();
  }

  async update(
    id: string,
    updateCountriesDto: UpdateCountriesDto,
  ): Promise<Countries> {
    return this.model.findByIdAndUpdate(id, updateCountriesDto).exec();
  }

  async delete(id: string): Promise<Countries> {
    return this.model.findByIdAndDelete(id).exec();
  }
}
