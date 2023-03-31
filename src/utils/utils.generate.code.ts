import { GetCurrentDate } from './utils.get.current-date';

export function getRandomCode(length: number) {
  return Math.floor(
    Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1),
  );
}

export function getRandomCodeProfile(length: number) {
  const number = getRandomCode(length);
  const year = new GetCurrentDate().getYear();
  const profileId = `${year}${number}`;
  return profileId;
}

export function getRandomCodeByYearMonthDate(length: number) {
  const number = getRandomCode(length);
  const month = new GetCurrentDate().getMonth();
  const date = new GetCurrentDate().getDate();
  const year = new GetCurrentDate().getYear();
  const numberCode = `${year}${month}${date}${number}`;
  return numberCode;
}

export function getRandomCodeReceiptId(length: number) {
  return getRandomCodeByYearMonthDate(length);
}

export function getRandomCodeSemester(length: number) {
  return getRandomCodeByYearMonthDate(length);
}

export function getRandomCodeVoluntee(length: number) {
  return getRandomCodeByYearMonthDate(length);
}
