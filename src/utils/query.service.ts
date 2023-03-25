/* eslint-disable @typescript-eslint/no-explicit-any */
import { DbConnection } from 'src/constants/db.mongo.connection';

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
}
