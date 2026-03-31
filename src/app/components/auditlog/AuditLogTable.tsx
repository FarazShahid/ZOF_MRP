// /components/audit/AuditLogTable.tsx
import React from "react";
import { ActionBadge } from "./ActionBadge";
import { ModuleBadge } from "./ModuleBadge";
import { AuditLogEntry } from "@/store/useAuditLogStore";
import Pagination from "../common/Pagination";
import { EyeIcon } from "lucide-react";

interface AuditLogTableProps {
  logs: AuditLogEntry[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRowClick: (log: AuditLogEntry) => void;
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

export const AuditLogTable: React.FC<AuditLogTableProps> = ({
  logs,
  currentPage,
  totalPages,
  onPageChange,
  onRowClick,
  pageSize,
  onPageSizeChange,
  pageSizeOptions,
}) => {
  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const initialsFromEmail = (email: string) => {
    if (!email) return "NA";
    const namePart = email.split("@")[0] || email;
    return namePart.slice(0, 2).toUpperCase();
  };

  return (
    <div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-slate-800">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                Date/Time
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                Module
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                Action
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                User (Email)
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                Details
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
            {logs.map((log) => {
              const { date, time } = formatDateTime(log.createdAt);
              return (
                <tr
                  key={log.id}
                  onClick={() => onRowClick(log)}
                  className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-slate-800/50"
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <div className="text-gray-900 dark:text-white font-medium">{date}</div>
                    <div className="text-xs text-gray-500 dark:text-slate-400">{time}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <ModuleBadge module={log.module} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <ActionBadge action={log.action} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          {initialsFromEmail(log.Email)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-slate-300">
                        {log.Email}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-slate-300">
                    <div className="max-w-xs truncate">{log.details}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      className="p-1.5 text-gray-400 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-md transition-colors"
                      onClick={(e) => { e.stopPropagation(); onRowClick(log); }}
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {logs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-slate-400">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        pageSize={pageSize}
        onPageSizeChange={onPageSizeChange}
        pageSizeOptions={pageSizeOptions}
      />
    </div>
  );
};
