export interface ImatchFindAward {
  $match?: {
    isDeleted?: boolean;
    type?: string;
    name?: RegExp;
    time?: {
      $gte?: Date;
      $lte?: Date;
    };
  };
}
