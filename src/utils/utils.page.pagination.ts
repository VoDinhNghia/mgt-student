export function skipLimitPagination(limit: number, page: number) {
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

export function skipLimitAndSortPagination(limit: number, page: number) {
  const result = [
    ...skipLimitPagination(limit, page),
    { $sort: { createdAt: -1 } },
  ];
  return result;
}
