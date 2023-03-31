/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from 'mongoose';
import { DbConnection } from 'src/constants/constants.db.mongo.connection';
import { CommonException } from 'src/exceptions/execeptions.common-error';
import { uniq } from 'lodash';
import { collections } from 'src/constants/constants.collections.name';

export class ValidateDto {
  db: any = new DbConnection();

  async idLists(collection: string, ids: string[]): Promise<string[]> {
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
      .find({ _id: { $in: listIds }, isDeleted: false });
    const documentLists = await cursorFind.toArray();
    const documentIds = documentLists.map((document: Record<string, any>) => {
      return document._id;
    });
    return documentIds;
  }

  async fieldId(collection: string, id: string): Promise<void> {
    const result = await this.db
      .collection(collection)
      .findOne({ _id: new Types.ObjectId(id), isDeleted: false });
    if (!result) {
      new CommonException(404, `Not found ${id} in collection ${collection}.`);
    }
  }

  async fieldOptions(
    collection: string,
    options: Record<string, any>,
    message: string,
  ): Promise<void> {
    const result = await this.db
      .collection(collection)
      .findOne({ ...options, isDeleted: false });
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

  async awards(
    profileDto: Record<string, any>,
    award: string[],
  ): Promise<Record<string, any>> {
    if (award.length > 0) {
      const awardIds = await this.idLists(collections.awards, award);
      profileDto.award = awardIds;
    }
    return profileDto;
  }
}
