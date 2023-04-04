import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users, UsersDocument } from '../users/schemas/users.schema';
import { Http } from 'src/utils/utils.http.sync-service';
import {
  keyAccessBlogService,
  keyAccessLibraryService,
} from 'src/constants/constant';
import { GetCurrentDate } from 'src/utils/utils.get.current-date';
import { ConfigService } from '@nestjs/config';
import { syncUserLookup } from 'src/utils/utils.lookup.query.service';

@Injectable()
export class SyncServiceService {
  constructor(
    @InjectModel(Users.name)
    private readonly userSchema: Model<UsersDocument>,
    private readonly configService: ConfigService,
  ) {}

  async migrateUser() {
    const url = `${this.configService.get('LIBRARY')}/api/users/migrate`;
    const body = await this.getAllUsers();
    const result = await new Http().post(url, keyAccessLibraryService, body);
    if (!result) {
      return null;
    }
    return result;
  }

  async migrateUserBlogService() {
    const url = `${this.configService.get('BLOG_SERVICE')}/api/user/migrate`;
    const body = await this.getAllUsers();
    const result = await new Http().post(url, keyAccessBlogService, body);
    if (!result) {
      return 'error';
    }
    return result;
  }

  async getAllUsers(): Promise<Users[]> {
    const lookup = syncUserLookup();
    const results = await this.userSchema.aggregate(lookup);
    return results;
  }

  async getUserForSyncData(): Promise<Users[]> {
    const current = new GetCurrentDate();
    const date = `${current.getYear()}-${current.getMonth()}-${current.getDate()}T00:00:01`;
    const match = {
      $match: {
        $or: [
          { createdAt: { $gte: new Date(date) } },
          { updatedAt: { $gte: new Date(date) } },
        ],
      },
    };
    const lookup = syncUserLookup();
    const aggregate = [match, ...lookup];
    const results = await this.userSchema.aggregate(aggregate);
    return results;
  }
}
