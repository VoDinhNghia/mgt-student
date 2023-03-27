export class GetCurrentDate {
  currentDate: Date = new Date();

  getDate() {
    const date = this.currentDate.getDate();
    if (date < 10) {
      return `0${date}`;
    }
    return date;
  }

  getMonth() {
    const month = this.currentDate.getMonth() + 1;
    if (month < 10) {
      return `0${month}`;
    }
    return month;
  }

  getYear() {
    const year = this.currentDate.getFullYear();
    return year;
  }

  getYearMonthDate() {
    const fullYear = `${this.getYear()}-${this.getMonth()}-${this.getDate()}`;
    return fullYear;
  }

  getFullDateTime() {
    return this.currentDate;
  }
}
