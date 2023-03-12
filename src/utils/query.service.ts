import { DbConnection } from 'src/constants/db.mongo.connection';

export class QueryService {
  db = new DbConnection();

  async findOneByOptions(
    collection: string,
    options: Record<string, any>,
  ): Promise<Record<string, any> | null> {
    const result = await this.db.collection(collection).findOne(options);
    return result;
  }

  async findByOptions(
    collection: string,
    options: Record<string, any>,
  ): Promise<Record<string, any>[]> {
    const cursorFind = await this.db.collection(collection).find(options);
    const results = await cursorFind.toArray();
    return results;
  }

  async findByAggregate(
    collection: string,
    aggregate = [],
  ): Promise<Record<string, any>[]> {
    const cursorAgg = await this.db.collection(collection).aggregate(aggregate);
    const results = await cursorAgg?.toArray();
    return results;
  }
}
