import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LookupCommon } from 'src/utils/lookup.query.aggregate-query';
import { Users, UsersDocument } from '../users/schemas/users.schema';
import { Http } from 'src/utils/http.sync-service';
import {
  keyAccessLibraryService,
  linkAccessService,
} from 'src/constants/constant';
import { GetCurrentDate } from 'src/utils/get.current-date';

@Injectable()
export class SyncServiceService {
  constructor(
    @InjectModel(Users.name)
    private readonly userSchema: Model<UsersDocument>,
  ) {}

  async migrateUser() {
    const url = `${linkAccessService.LIBRARY}/api/users/migrate`;
    const body = await this.getAllUsers();
    const result = await new Http().post(url, keyAccessLibraryService, body);
    if (!result) {
      return null;
    }
    return result;
  }

  async getAllUsers(): Promise<Users[]> {
    const lookup = this.lookupUser();
    const results = await this.userSchema.aggregate(lookup);
    return results;
  }

  async getUserForSyncData(): Promise<Users[]> {
    const current = new GetCurrentDate();
    const date = `${current.getYear()}-${current.getMonth()}-${
      Number(current.getDate()) - 1
    }T00:00:01`;
    const match = {
      $match: {
        $or: [
          { createdAt: { $gte: new Date(date) } },
          { updatedAt: { $gte: new Date(date) } },
        ],
      },
    };
    const lookup = this.lookupUser();
    const aggregate = [match, ...lookup];
    const results = await this.userSchema.aggregate(aggregate);
    return results;
  }

  private lookupUser() {
    const lookup: any = new LookupCommon([
      {
        from: 'profiles',
        localField: '_id',
        foreignField: 'user',
        as: 'profile',
        unwind: true,
      },
    ]);
    return lookup;
  }
}