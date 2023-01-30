import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UnionCreateDto } from './dtos/unions.create.dto';
import { Union, UnionDocument } from './schemas/unions.schema';

@Injectable()
export class UnionsService {
  constructor(
    @InjectModel(Union.name) private readonly unionSchema: Model<UnionDocument>,
  ) {}

  async createUnion(unionCreateDto: UnionCreateDto) {
    try {
      const result = await new this.unionSchema(unionCreateDto).save();
      return result;
    } catch (error) {
      throw new HttpException(
        { statusCode: 500, message: 'System error.' },
        500,
      );
    }
  }
}
