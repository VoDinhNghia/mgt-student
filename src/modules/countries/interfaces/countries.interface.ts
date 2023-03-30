import { Types } from 'mongoose';

export interface IqueryCountries {
  isDeleted?: boolean;
  name?: RegExp;
}

export interface IqueryProvinces {
  isDeleted?: boolean;
  name?: RegExp;
  countryId?: Types.ObjectId;
}

export interface IqueryDistricts {
  isDeleted?: boolean;
  name?: RegExp;
  provinceId?: Types.ObjectId;
}

export interface IqueryWards {
  isDeleted?: boolean;
  name?: RegExp;
  districtId?: Types.ObjectId;
}
