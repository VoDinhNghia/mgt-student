export interface ImatchFindAuth {
  $match?: {
    email: string;
    passWord: string;
    status: string;
  };
}
