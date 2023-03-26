/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from 'mongoose';
import { collections } from 'src/constants/collections.name';
import { trainningPointDefault } from 'src/constants/constant';
import { DbConnection } from 'src/constants/db.mongo.connection';
import { trainningPointScholarshipLookup } from './utils.lookup.query.service';

export class QueryService {
  db = new DbConnection();

  async findOneByOptions(
    collection: string,
    options: Record<string, any>,
  ): Promise<Record<string, any> | null> {
    const query = { ...options, isDeleted: false };
    const result = await this.db.collection(collection).findOne(query);
    return result;
  }

  async findByOptions(
    collection: string,
    options: Record<string, any>,
  ): Promise<Record<string, any>[]> {
    const query = { ...options, isDeleted: false };
    const cursorFind = await this.db.collection(collection).find(query);
    const results = await cursorFind.toArray();
    return results;
  }

  async findByAggregate(
    collection: string,
    agg = [],
  ): Promise<Record<string, any>[]> {
    const match = { $match: { isDeleted: false } };
    const aggregate = [match, ...agg];
    const cursorAgg = await this.db.collection(collection).aggregate(aggregate);
    const results = await cursorAgg?.toArray();
    return results;
  }

  async getUserPaymentStudyFee(
    semester: string,
    profile: string,
  ): Promise<Record<string, any>> {
    const options = {
      semester: new Types.ObjectId(semester),
      user: new Types.ObjectId(profile),
    };
    const result = await this.findOneByOptions(
      collections.payment_study_fees,
      options,
    );
    return result;
  }

  async getUserTrainningPoint(
    profileId: string,
    semesterId: string,
  ): Promise<number> {
    const lookup = trainningPointScholarshipLookup();
    const aggregate = [
      {
        $match: {
          user: new Types.ObjectId(profileId),
          semester: new Types.ObjectId(semesterId),
          status: true,
        },
      },
      ...lookup,
    ];
    const results = await this.findByAggregate(
      collections.trainning_points,
      aggregate,
    );
    const totalTrainningPoint = results.reduce(
      (x: any, y: any) => (x.program?.point ?? 0) + (y.program?.point ?? 0),
      0,
    );
    const point = totalTrainningPoint + trainningPointDefault;
    return point > 100 ? 100 : point;
  }
}
