export interface IqueryAwards {
  isDeleted?: boolean;
  type?: string;
  name?: RegExp;
  time?: {
    $gte?: Date;
    $lte?: Date;
  };
}
