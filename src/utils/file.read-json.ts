import { readFileSync } from 'fs';
import { join } from 'path';

export function readFileJson(fileName: string) {
  return JSON.parse(
    readFileSync(
      join(__dirname, '../../..', `./src/files/import-countries/${fileName}`),
      'utf-8',
    ),
  );
}
