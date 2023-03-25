/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable class-methods-use-this */
import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';

let dbInstance: any;

@Injectable()
export class DbConnection {
  constructor() {
    this.connect();
  }

  connect() {
    const client = new MongoClient(process.env.MONGO_URL);
    client
      .connect()
      .then((connection) => {
        console.log('test connection');
        dbInstance = connection.db();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  collection(name: string) {
    if (!dbInstance) {
      console.log('connection error');
    }
    return dbInstance.collection(name);
  }
}
