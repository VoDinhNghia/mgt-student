export interface IsemesterQuery {
  isDeleted?: boolean;
  name?: RegExp;
  $or?: {
    name?: RegExp;
    year?: RegExp;
  }[];
}
