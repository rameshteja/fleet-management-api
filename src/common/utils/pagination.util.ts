import { PaginationMetadata } from '../interfaces/pagination.interface';

export function calculatePagination(
  page: number,
  limit: number,
  totalRecords: number,
): PaginationMetadata {
  // No records
  if (totalRecords === 0) {
    return {
      currentPage: 0,
      previousPage: null,
      nextPage: null,
      totalPages: 0,
      totalRecords: 0,
      limit,
    };
  }

  const totalPages = Math.ceil(
    totalRecords / limit,
  );

  const currentPage = Math.min(
    page,
    totalPages,
  );

  const previousPage =
    currentPage > 1
      ? currentPage - 1
      : null;

  const nextPage =
    currentPage < totalPages
      ? currentPage + 1
      : null;

  return {
    currentPage,
    previousPage,
    nextPage,
    totalPages,
    totalRecords,
    limit,
  };
}