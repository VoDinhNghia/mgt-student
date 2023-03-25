/* eslint-disable class-methods-use-this */
export class QueryPagination {
  skipLimit(limit: number, page: number) {
    let result = [];
    if (limit && page) {
      result = [
        {
          $skip: Number(limit) * Number(page) - Number(limit),
        },
        { $limit: Number(limit) },
      ];
    }
    return result;
  }

  skipLimitAndSort(limit: number, page: number) {
    const result = [
      ...this.skipLimit(limit, page),
      { $sort: { createdAt: -1 } },
    ];
    return result;
  }
}
