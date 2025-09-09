"use client";

import React, { useState, useMemo } from "react";
import { LuShield } from "react-icons/lu";
import { AuditLogFilters } from "./AuditLogFilters";
import { AuditLogTable } from "./AuditLogTable";
import { AuditLogDetailSidebar } from "./AuditLogDetailSidebar";
import { AuditLog, FilterState } from "@/src/types/audit";
import { mockAuditLogs } from "@/src/data/mockAuditLogs";
import AuditLogStats from "./Stats";

export const AuditLogs: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: { start: "", end: "" },
    module: "",
    action: "",
    user: "",
    search: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const itemsPerPage = 10;

  // Filter logs based on current filters
  const filteredLogs = useMemo(() => {
    return mockAuditLogs.filter((log) => {
      // Date range filter
      if (
        filters.dateRange.start &&
        new Date(log.timestamp) < new Date(filters.dateRange.start)
      ) {
        return false;
      }
      if (
        filters.dateRange.end &&
        new Date(log.timestamp) > new Date(filters.dateRange.end)
      ) {
        return false;
      }

      // Module filter
      if (filters.module && log.module !== filters.module) {
        return false;
      }

      // Action filter
      if (filters.action && log.action !== filters.action) {
        return false;
      }

      // User filter
      if (
        filters.user &&
        !log.user.toLowerCase().includes(filters.user.toLowerCase())
      ) {
        return false;
      }

      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return (
          log.details.toLowerCase().includes(searchTerm) ||
          log.user.toLowerCase().includes(searchTerm) ||
          log.module.toLowerCase().includes(searchTerm) ||
          log.action.toLowerCase().includes(searchTerm) ||
          log.entityId.toLowerCase().includes(searchTerm)
        );
      }

      return true;
    });
  }, [filters]);

  // Paginate filtered logs
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLogs, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  const handleRowClick = (log: AuditLog) => {
    setSelectedLog(log);
    setSidebarOpen(true);
  };

  const handleExport = (format: "csv" | "pdf") => {
    // In a real application, this would trigger actual export functionality
    alert(`Exporting audit logs as ${format.toUpperCase()}...`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className=" border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <LuShield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
              <p className="text-sm text-gray-500">
                Track all system activities and changes across modules
              </p>
            </div>
          </div>

          {/* Stats */}
          <AuditLogStats
            mockAuditLogsLength={mockAuditLogs.length}
            filteredLogsLength={filteredLogs.length}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
      </div>

      {/* Filters */}
      <AuditLogFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onExport={handleExport}
      />

      {/* Table */}
      <div className="px-6 py-4">
        <div className="rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <AuditLogTable
            logs={paginatedLogs}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onRowClick={handleRowClick}
          />
        </div>
      </div>

      {/* Detail Sidebar */}
      <AuditLogDetailSidebar
        log={selectedLog}
        isOpen={sidebarOpen}
        onClose={() => {
          setSidebarOpen(false);
          setSelectedLog(null);
        }}
      />
    </div>
  );
};
