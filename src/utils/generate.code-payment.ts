import { GetCurrentDate } from './get.current-date';

export function getRandomCodeReceiptId(length: number) {
  const number = Math.floor(
    Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1),
  );
  const currentMonth = new GetCurrentDate().getMonth();
  const currentDate = new GetCurrentDate().getDate();
  const receiptId = `${currentMonth}${currentDate}${number}`;
  return receiptId;
}
