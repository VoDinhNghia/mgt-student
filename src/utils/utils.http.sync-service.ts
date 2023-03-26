/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpService } from '@nestjs/axios';

export class Http {
  private http = new HttpService();

  async get(
    url: string,
    keyAccess: string,
  ): Promise<Record<string, any>[] | null> {
    try {
      const results = this.http.get(url, {
        headers: {
          'key-access-secret': keyAccess,
        },
      });
      return (await results.toPromise())?.data?.data;
    } catch {
      return null;
    }
  }

  async post(
    url: string,
    keyAccess: string,
    body: Record<string, any>,
  ): Promise<Record<string, any>[] | null> {
    try {
      const results = this.http.post(url, body, {
        headers: {
          'key-access-secret': keyAccess,
        },
      });
      return (await results.toPromise())?.data?.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
