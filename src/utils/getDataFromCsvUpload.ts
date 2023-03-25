/* eslint-disable @typescript-eslint/no-explicit-any */
import { parse } from 'papaparse';

export const getDataFromCsvFileUpload = (data: any) => {
  const csvData = [];
  parse(data, {
    header: true,
    worker: true,
    delimiter: ',',
    step: (row: any) => {
      csvData.push(row.data);
    },
    complete: () => {
      console.log('Done!');
    },
  });
  return csvData;
};
