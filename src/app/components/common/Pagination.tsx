import React, { useEffect, useMemo } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  totalItems?: number;
  startIndex?: number;
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
  totalItems,
  startIndex = 0,
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
  const showingText =
    totalItems != null && startIndex != null
      ? `Showing ${startIndex + 1} to ${Math.min(startIndex + effectivePageSize, totalItems)} of ${totalItems} products`
      : null;

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800">
      <div className="text-sm text-slate-400">
        {showingText ?? (
          <>
            Showing page <span className="font-medium">{Math.max(1, Math.min(currentPage, totalPages || 1))}</span> of{" "}
            <span className="font-medium">{totalPages || 1}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1 || totalPages === 0}
          className="px-3 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
        >
          Previous
        </button>

        {items.map((item, index) => {
          if (item === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 bg-slate-800 text-slate-400 rounded-lg text-sm"
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
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                currentPage === pageNum
                  ? "bg-purple-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-3 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;


