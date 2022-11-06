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
    return await this.model.find().exec();
  }

  async findOne(id: string): Promise<Countries> {
    return await this.model.findById(id).exec();
  }

  async create(CreateCoutriesDto: CreateCoutriesDto): Promise<Countries> {
    return await new this.model({
      ...CreateCoutriesDto,
      createdAt: new Date(),
    }).save();
  }

  async update(
    id: string,
    UpdateCountriesDto: UpdateCountriesDto,
  ): Promise<Countries> {
    return await this.model.findByIdAndUpdate(id, UpdateCountriesDto).exec();
  }

  async delete(id: string): Promise<Countries> {
    return await this.model.findByIdAndDelete(id).exec();
  }
}
