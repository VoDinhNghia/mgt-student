import { parse } from 'papaparse';

export const getDataFromCsvFileUpload = (data: any) => {
  const csvData = [];
  parse(data, {
    header: true,
    worker: true,
    delimiter: ',',
    step: function (row: any) {
      csvData.push(row.data);
    },
    complete: function () {
      console.log('Done!');
    },
  });
  return csvData;
};
