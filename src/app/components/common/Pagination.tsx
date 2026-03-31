import React, { useEffect, useMemo, useState, useRef } from "react";
import { ChevronDown } from "lucide-react";

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
  itemLabel?: string;
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

const PageSizeDropdown: React.FC<{
  value: number;
  options: number[];
  onChange: (value: number) => void;
}> = ({ value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 pl-3 pr-7 py-1 min-w-[60px] text-xs font-medium rounded-md bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:border-emerald-500 dark:hover:border-emerald-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors cursor-pointer relative"
      >
        {value}
        <ChevronDown className={`w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute bottom-full mb-1 left-0 min-w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg z-50 p-1 max-h-48 overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition-colors ${
                value === opt
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-700 dark:text-slate-300 hover:bg-emerald-500/15 hover:text-emerald-700 dark:hover:text-emerald-400'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
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
  itemLabel = "items",
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


  const endIndex = Math.min(startIndex + effectivePageSize, totalItems ?? 0);
  const rangeText =
    totalItems != null
      ? `Showing ${startIndex + 1} to ${endIndex} of ${totalItems} ${itemLabel}`
      : null;

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-slate-800">
      {/* Left: Show per page dropdown + record range */}
      <div className="flex items-center gap-3">
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-slate-400">Show</span>
            <PageSizeDropdown
              value={effectivePageSize}
              options={sizeOptions}
              onChange={onPageSizeChange}
            />
            <span className="text-xs text-gray-500 dark:text-slate-400">per page</span>
          </div>
        )}
        <span className="text-xs text-gray-500 dark:text-slate-400">
          {rangeText ?? (
            <>
              Showing page <span className="font-medium">{Math.max(1, Math.min(currentPage, totalPages || 1))}</span> of{" "}
              <span className="font-medium">{totalPages || 1}</span>
            </>
          )}
        </span>
      </div>

      {/* Right: Page buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1 || totalPages === 0}
          className="px-2.5 py-1.5 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-300 rounded-md text-xs font-medium hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
        >
          Previous
        </button>

        {items.map((item, index) => {
          if (item === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2.5 py-1.5 text-gray-400 dark:text-slate-500 text-xs"
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
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                currentPage === pageNum
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-2.5 py-1.5 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-300 rounded-md text-xs font-medium hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;


