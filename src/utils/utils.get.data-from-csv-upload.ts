import { parse } from 'papaparse';

export const getDataFromCsvFileUpload = (data: string) => {
  const csvData = [];
  parse(data, {
    header: true,
    worker: true,
    delimiter: ',',
    step: (row) => {
      csvData.push(row.data);
    },
    complete: () => {
      console.log('Done!');
    },
  });

  return csvData;
};
