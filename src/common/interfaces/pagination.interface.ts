export interface PaginationMetadata {
  currentPage: number;
  previousPage: number | null;
  nextPage: number | null;
  totalPages: number;
  totalRecords: number;
  limit: number;
}
