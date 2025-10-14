import React, { useEffect, useMemo } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

const getPaginationItems = (
  current: number,
  total: number,
  siblingCount: number = 1
): (number | "...")[] => {
  const totalPageNumbers = siblingCount * 2 + 5; // first, last, current, 2 siblings, and 2 dots

  if (total <= totalPageNumbers) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(current - siblingCount, 2);
  const rightSiblingIndex = Math.min(current + siblingCount, total - 1);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < total - 1;

  const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const firstPageIndex = 1;
  const lastPageIndex = total;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = range(1, leftItemCount);
    return [...leftRange, "...", lastPageIndex];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = range(total - rightItemCount + 1, total);
    return [firstPageIndex, "...", ...rightRange];
  }

  return [
    firstPageIndex,
    "...",
    ...range(leftSiblingIndex, rightSiblingIndex),
    "...",
    lastPageIndex,
  ];
};

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  pageSize,
  onPageSizeChange,
  pageSizeOptions,
}) => {
  // Clamp current page when totalPages changes or becomes smaller than current
  useEffect(() => {
    if (totalPages <= 0) return;
    if (currentPage < 1) {
      onPageChange(1);
    } else if (currentPage > totalPages) {
      onPageChange(totalPages);
    }
  }, [currentPage, totalPages, onPageChange]);

  const items = useMemo(
    () => getPaginationItems(currentPage, totalPages, siblingCount),
    [currentPage, totalPages, siblingCount]
  );

  const sizeOptions = useMemo(
    () => pageSizeOptions ?? [5, 10, 20, 50, 100],
    [pageSizeOptions]
  );
  const effectivePageSize = pageSize ?? sizeOptions[0];

  return (
    <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div className="flex-1 flex items-center justify-between sm:hidden">
        <div className="flex items-center gap-2">
          <label htmlFor="mobile-page-size" className="text-sm text-gray-700">
            Show
          </label>
          <select
            id="mobile-page-size"
            value={effectivePageSize}
            onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
            className="block border border-gray-300 rounded-md text-sm py-1 px-2 bg-white text-gray-700 focus:outline-none"
          >
            {sizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1 || totalPages === 0}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="mx-2 text-sm text-gray-700">
          Page <span className="font-medium">{Math.max(1, Math.min(currentPage, totalPages || 1))}</span> of {" "}
          <span className="font-medium">{totalPages || 1}</span>
        </span>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="desktop-page-size" className="text-sm text-gray-700">
              Show
            </label>
            <select
              id="desktop-page-size"
              value={effectivePageSize}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
              className="block border border-gray-300 rounded-md text-sm py-1 px-2 bg-white text-gray-700 focus:outline-none"
            >
              {sizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-700">per page</span>
          </div>
          <p className="text-sm text-gray-700">
            Showing page <span className="font-medium">{Math.max(1, Math.min(currentPage, totalPages || 1))}</span> of {" "}
            <span className="font-medium">{totalPages || 1}</span>
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || totalPages === 0}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaChevronLeft className="h-5 w-5" />
            </button>
            {items.map((item, index) => {
              if (item === "...") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500"
                  >
                    ...
                  </span>
                );
              }
              const pageNum = item as number;
              return (
                <button
                  key={`page-${pageNum}`}
                  onClick={() => onPageChange(pageNum)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === pageNum
                      ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaChevronRight className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;


