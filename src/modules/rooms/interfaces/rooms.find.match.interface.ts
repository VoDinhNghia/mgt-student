export interface ImatchFindRoom {
  $match?: {
    isDeleted?: boolean;
    name?: RegExp;
    type?: string;
  };
}
