import { GetCurrentDate } from './utils.get.current-date';

export class GenerateCode {
  private currentDate: GetCurrentDate = new GetCurrentDate();
  private randomCode: number = Math.random();

  public getRandomCode(length: number) {
    return Math.floor(
      Math.pow(10, length - 1) + this.randomCode * 9 * Math.pow(10, length - 1),
    );
  }

  public getRandomCodeProfile(length: number) {
    const number = this.getRandomCode(length);
    const year = this.currentDate.getYear();
    const profileId = `${year}${number}`;

    return profileId;
  }

  public getRandomCodeByYearMonthDate(length: number) {
    const number = this.getRandomCode(length);
    const month = this.currentDate.getMonth();
    const date = this.currentDate.getDate();
    const year = this.currentDate.getYear();
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
