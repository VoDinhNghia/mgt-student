import { Types } from 'mongoose';
import { DbConnection } from 'src/constants/db.mongo.connection';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { uniq } from 'lodash';

export class ValidateDto {
  db = new DbConnection();

  async idLists(collection: string, ids = []): Promise<string[]> {
    if (ids.length === 0) {
      return ids;
    }
    const idsUniq = uniq(ids);
    const listIds = [];
    for (const id of idsUniq) {
      try {
        listIds.push(new Types.ObjectId(id));
      } catch {
        continue;
      }
    }
    const cursorFind = await this.db
      .collection(collection)
      .find({ _id: { $in: listIds } });
    const documentLists = await cursorFind.toArray();
    const documentIds = documentLists.map((document: Record<string, any>) => {
      return document._id;
    });
    return documentIds;
  }

  async fieldId(collection: string, id: string): Promise<void> {
    const result = await this.db
      .collection(collection)
      .findOne({ _id: new Types.ObjectId(id) });
    if (!result) {
      new CommonException(404, `Not found ${id} in collection ${collection}.`);
    }
  }

  async fieldOptions(
    collection: string,
    options: Record<string, any>,
    message: string,
  ): Promise<void> {
    const result = await this.db.collection(collection).findOne(options);
    if (!result) {
      new CommonException(404, `${message} not found.`);
    }
  }

  async existedId(collection: string, id: string): Promise<void> {
    const result = await this.db
      .collection(collection)
      .findOne({ _id: new Types.ObjectId(id) });
    if (result) {
      new CommonException(
        409,
        `${id} existed already in collection ${collection}.`,
      );
    }
  }

  async existedByOptions(
    collection: string,
    options: Record<string, any>,
    message: string,
  ): Promise<void> {
    const result = await this.db.collection(collection).findOne(options);
    if (result) {
      new CommonException(
        409,
        `${message} existed already in collection ${collection}.`,
      );
    }
  }
}
