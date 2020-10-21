export abstract class PaginationResponse {
  next?: Pagination;
  prev?: Pagination;
}

export abstract class Pagination {
  page?: number;
  limit?: number;
}
