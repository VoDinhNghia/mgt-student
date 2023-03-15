import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LookupCommon } from 'src/utils/lookup.query.aggregate-query';
import { Users, UsersDocument } from '../users/schemas/users.schema';

@Injectable()
export class SyncServiceService {
  constructor(
    @InjectModel(Users.name)
    private readonly userSchema: Model<UsersDocument>,
  ) {}

  async getAllUsers(): Promise<Users[]> {
    const lookup: any = new LookupCommon([
      {
        from: 'profiles',
        localField: '_id',
        foreignField: 'user',
        as: 'profile',
        unwind: true,
      },
    ]);
    const results = await this.userSchema.aggregate(lookup);
    return results;
  }
}
