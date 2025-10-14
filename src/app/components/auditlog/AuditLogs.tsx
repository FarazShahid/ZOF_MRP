"use client";

import React, { useState, useMemo, useEffect } from "react";
import { LuShield } from "react-icons/lu";
import { AuditLogFilters } from "./AuditLogFilters";
import { AuditLogTable } from "./AuditLogTable";
import { AuditLog, FilterState } from "@/src/types/audit";
import { mockAuditLogs } from "@/src/data/mockAuditLogs";
import AuditLogStats from "./Stats";
import useAuditLogStore, { AuditLogEntry } from "@/store/useAuditLogStore";
import { AuditLogDetailSidebar } from "./AuditLogDetailSidebar";

export const AuditLogs: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: { start: "", end: "" },
    module: "",
    action: "",
    user: "",
    search: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { fetchAuditLogs, logs, loading } = useAuditLogStore();

  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  // Build dynamic select options from live data (unique modules/actions)
  const moduleOptions = useMemo(
    () => Array.from(new Set(logs.map((l) => l.module))).sort(),
    [logs]
  );

  const actionOptions = useMemo(
    () => Array.from(new Set(logs.map((l) => l.action))).sort(),
    [logs]
  );

  // Helpful date parser that respects empty inputs
  const isWithinDate = (iso: string, start: string, end: string) => {
    if (!start && !end) return true;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return false;

    if (start) {
      const s = new Date(start);
      s.setHours(0, 0, 0, 0);
      if (d < s) return false;
    }
    if (end) {
      const e = new Date(end);
      e.setHours(23, 59, 59, 999);
      if (d > e) return false;
    }
    return true;
  };

  // Filter logs based on current filters
  const filteredLogs = useMemo(() => {
    const searchTerm = filters.search.trim().toLowerCase();
    const userTerm = filters.user.trim().toLowerCase();

    return logs.filter((log) => {
      // Date range
      if (
        !isWithinDate(
          log.createdAt,
          filters.dateRange.start,
          filters.dateRange.end
        )
      ) {
        return false;
      }

      // Module
      if (filters.module && log.module !== filters.module) return false;

      // Action
      if (filters.action && log.action !== filters.action) return false;

      // User (matches Email)
      if (userTerm && !log.Email.toLowerCase().includes(userTerm)) return false;

      // Global Search
      if (searchTerm) {
        const hay = [
          log.details,
          log.Email,
          log.module,
          log.action,
          String(log.id),
          String(log.entityId ?? ""),
          log.log_ip,
          log.device,
        ]
          .join(" ")
          .toLowerCase();

        if (!hay.includes(searchTerm)) return false;
      }

      return true;
    });
  }, [logs, filters]);

  // Paginate filtered logs
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLogs, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / itemsPerPage));

  // Clamp current page when itemsPerPage changes or filtered length changes
  useEffect(() => {
    const newTotalPages = Math.max(
      1,
      Math.ceil(filteredLogs.length / Math.max(1, itemsPerPage))
    );
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }
  }, [itemsPerPage, filteredLogs.length]);

  const handleRowClick = (log: AuditLogEntry) => {
    setSelectedLog(log);
    setSidebarOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageSizeChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
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
            totalLogsLength={logs.length}
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
        moduleOptions={moduleOptions}
        actionOptions={actionOptions}
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
            pageSize={itemsPerPage}
            onPageSizeChange={handlePageSizeChange}
            pageSizeOptions={[5, 10, 20, 50, 100]}
          />
        </div>
      </div>
    </div>
  );
};
