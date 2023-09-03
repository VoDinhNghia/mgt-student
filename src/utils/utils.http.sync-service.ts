import { HttpService } from '@nestjs/axios';

export class Http {
  private http: HttpService = new HttpService();

  public async get(url: string, keyAccess: string): Promise<object[] | null> {
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

  public async post(
    url: string,
    keyAccess: string,
    body: string | object | string[] | object[],
  ): Promise<object[] | null> {
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
