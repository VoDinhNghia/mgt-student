import { HttpException } from '@nestjs/common';
import { join } from 'path';
import { GetCurrentDate } from 'src/utils/get.current-date';

export const imageFileFilter = (
  req: Record<any, any>,
  file: Record<string, any>,
  callback: any,
) => {
  if (!file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/)) {
    return callback(
      new HttpException(
        { statusCode: 400, message: 'Only *.jpg|webp|png|jpeg file accepted.' },
        400,
      ),
      false,
    );
  }
  callback(null, true);
};

export const csvFileFilter = (
  req: Record<any, any>,
  file: Record<string, any>,
  callback: any,
) => {
  if (!file.originalname.match(/\.(csv)$/)) {
    return callback(
      new HttpException(
        { statusCode: 400, message: 'Only allowed *.csv file' },
        400,
      ),
      false,
    );
  }
  callback(null, true);
};

export const destinationAttachment = (
  req: Record<any, any>,
  file: Record<string, any>,
  cb: any,
) => {
  cb(null, join(__dirname, '../../..', './src/public/attachments'));
};

export const destinationImportUser = (
  req: Record<any, any>,
  file: Record<string, any>,
  cb: any,
) => {
  cb(null, join(__dirname, '../../..', './src/files/import-user'));
};

export const fileName = (
  req: Record<any, any>,
  file: Record<string, any>,
  cb: any,
) => {
  const getCurrentDate = new GetCurrentDate().getYearMonthDate();
  cb(null, `${getCurrentDate}-${file.originalname}`);
};
