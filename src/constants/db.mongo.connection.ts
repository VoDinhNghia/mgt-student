import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { mongoUrl } from '../configs/config';

let dbInstance: any;

@Injectable()
export class DbConnection {
  constructor() {
    this.connect();
  }

  connect() {
    const client = new MongoClient(mongoUrl);
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
    console.log('test call connection');
    if (dbInstance) return dbInstance.collection(name);
  }
}
