export class GetCurrentDate {
  private currentDate: Date = new Date();

  public getDate() {
    const date = this.currentDate.getDate();
    if (date < 10) {
      return `0${date}`;
    }

    return date;
  }

  public getMonth() {
    const month = this.currentDate.getMonth() + 1;
    if (month < 10) {
      return `0${month}`;
    }

    return month;
  }

  public getYear() {
    const year = this.currentDate.getFullYear();

    return year;
  }

  public getYearMonthDate() {
    const fullYear = `${this.getYear()}-${this.getMonth()}-${this.getDate()}`;

    return fullYear;
  }

  public getFullDateTime() {
    return this.currentDate;
  }
}
