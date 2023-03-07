export function getRandomCodeReceiptId(length: number) {
  const number = Math.floor(
    Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1),
  );
  const toDate = new Date();
  const mm = toDate.getMonth() + 1;
  const dd = toDate.getDate();
  const receiptId = `${dd}-${mm}-${number}`;
  return receiptId;
}
