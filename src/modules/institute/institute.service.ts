import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { LookupCommon } from 'src/utils/lookup.query.aggregate-query';
import { ValidateDto } from 'src/validates/validate.common.dto';
import { CreateInstituteDto } from './dtos/institute.create.dto';
import { UpdateInstituteDto } from './dtos/institute.update.dto';
import { InstitudeDocument, Institudes } from './schemas/institute.schema';

@Injectable()
export class InstituteService {
  constructor(
    @InjectModel(Institudes.name)
    private readonly institutiSchema: Model<InstitudeDocument>,
  ) {}

  async createInstitute(instituteDto: CreateInstituteDto): Promise<Institudes> {
    await this.validateInstituteDto(instituteDto);
    const newInstitute = await new this.institutiSchema(instituteDto).save();
    const result = await this.findInstituteById(newInstitute._id);
    return result;
  }

  async updateInstitute(
    id: string,
    instituteDto: UpdateInstituteDto,
  ): Promise<Institudes> {
    await this.validateInstituteDto(instituteDto);
    await this.institutiSchema.findByIdAndUpdate(id, instituteDto);
    const result = await this.findInstituteById(id);
    return result;
  }

  async findInstituteById(id: string): Promise<Institudes> {
    const match: Record<string, any> = {
      $match: { _id: new Types.ObjectId(id) },
    };
    const lookup = this.lookupInstitute();
    const aggregate = [match, ...lookup];
    const result = await this.institutiSchema.aggregate(aggregate);
    if (!result[0]) {
      new CommonException(404, 'Institute not found.');
    }
    return result[0];
  }

  async findAllInstitudes(): Promise<Institudes[]> {
    const lookup = this.lookupInstitute();
    const results = await this.institutiSchema.aggregate(lookup);
    return results;
  }

  async deleteInstitude(id: string): Promise<void> {
    await this.findInstituteById(id);
    await this.institutiSchema.findByIdAndDelete(id);
  }

  async validateInstituteDto(dtos: CreateInstituteDto): Promise<void> {
    const { parson, viceParson, contacts = {} } = dtos;
    const { office } = contacts;
    const validate = new ValidateDto();
    if (parson) {
      await validate.fieldId('profiles', parson);
    }
    if (viceParson) {
      await validate.fieldId('profiles', viceParson);
    }
    if (office) {
      await validate.fieldId('rooms', office);
    }
  }

  private lookupInstitute() {
    const lookup: any = new LookupCommon([
      {
        from: 'profiles',
        localField: 'parson',
        foreignField: '_id',
        as: 'parson',
        unwind: true,
      },
      {
        from: 'profiles',
        localField: 'viceParson',
        foreignField: '_id',
        as: 'viceParson',
        unwind: true,
      },
      {
        from: 'rooms',
        localField: 'contacts.office',
        foreignField: '_id',
        as: 'office',
        unwind: true,
      },
      {
        from: 'attachments',
        localField: 'attachment',
        foreignField: '_id',
        as: 'attachment',
        unwind: false,
      },
    ]);
    return lookup;
  }
}
