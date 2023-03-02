export class Pagination {
  constructor(limit: number, page: number, aggregate = []) {
    let result = aggregate;
    if (limit && page) {
      result = [
        ...aggregate,
        {
          $skip: Number(limit) * Number(page) - Number(limit),
        },
        { $limit: Number(limit) },
      ];
    }
    return result;
  }
}
