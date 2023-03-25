import { IschemaCommon } from 'src/utils/fields-common.interface';

export interface Iusers extends IschemaCommon {
  email?: string;
  passWord?: string;
  statusLogin?: boolean;
  status?: string;
  role?: string;
}
