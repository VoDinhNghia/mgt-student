import { GetCurrentDate } from './utils.get.current-date';

export class GenerateCode {
  private randomCode: number = Math.random();

  public getRandomCode(length: number) {
    return Math.floor(
      Math.pow(10, length - 1) + this.randomCode * 9 * Math.pow(10, length - 1),
    );
  }

  public getRandomCodeProfile(length: number) {
    const number = this.getRandomCode(length);
    const year = new GetCurrentDate().getYear();
    const profileId = `${year}${number}`;

    return profileId;
  }

  public getRandomCodeByYearMonthDate(length: number) {
    const number = this.getRandomCode(length);
    const month = new GetCurrentDate().getMonth();
    const date = new GetCurrentDate().getDate();
    const year = new GetCurrentDate().getYear();
    const numberCode = `${year}${month}${date}${number}`;

    return numberCode;
  }

  public getRandomCodeReceiptId(length: number) {
    return this.getRandomCodeByYearMonthDate(length);
  }

  public getRandomCodeSemester(length: number) {
    return this.getRandomCodeByYearMonthDate(length);
  }

  public getRandomCodeVoluntee(length: number) {
    return this.getRandomCodeByYearMonthDate(length);
  }
}
