// /components/audit/AuditLogTable.tsx
import React from "react";
import { ActionBadge } from "./ActionBadge";
import { ModuleBadge } from "./ModuleBadge";
import { AuditLogEntry } from "@/store/useAuditLogStore";
import Pagination from "../common/Pagination";

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
    <div className="">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date/Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Module
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User (Email)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {logs.map((log) => {
              const { date, time } = formatDateTime(log.createdAt);
              return (
                <tr
                  key={log.id}
                  onClick={() => onRowClick(log)}
                  className="cursor-pointer transition-colors hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="text-gray-900 font-medium">{date}</div>
                    <div className="text-gray-500">{time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ModuleBadge module={log.module} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ActionBadge action={log.action} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-700">
                            {initialsFromEmail(log.Email)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {log.Email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="max-w-xs truncate">{log.details}</div>
                  </td>
                </tr>
              );
            })}
            {logs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
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
