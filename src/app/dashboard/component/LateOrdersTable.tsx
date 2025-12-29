"use client";

import React, { useEffect, useMemo, useRef } from "react";
import ViewMoreButton from "./ViewMoreButton";
import useDashboardReportsStore from "@/store/useDashboardReportsStore";

const LateOrdersTable: React.FC = () => {
  const lateOrders = useDashboardReportsStore((s) => s.lateOrders);
  const loading = useDashboardReportsStore((s) => s.loading);
  const fetchLateOrders = useDashboardReportsStore((s) => s.fetchLateOrders);

  const hasRequested = useRef(false);
  useEffect(() => {
    if (!hasRequested.current && (!lateOrders || lateOrders.length === 0) && !loading) {
      hasRequested.current = true;
      fetchLateOrders();
    }
  }, [lateOrders, loading, fetchLateOrders]);

  const rows = useMemo(() => {
    const sorted = [...(lateOrders ?? [])]?.sort((a, b) => {
      const da = new Date(a.deadline).getTime();
      const db = new Date(b.deadline).getTime();
      return db - da; // latest (most recent) deadlines first
    });
    return sorted?.slice(0, 5)?.map((o) => ({
      id: o.orderId,
      orderNo: o.orderNumber,
      orderName: o.orderName,
      client: o.clientName,
      dueDate: (() => {
        try {
          const d = new Date(o.deadline);
          return d.toLocaleDateString("en-CA"); // YYYY-MM-DD
        } catch {
          return "";
        }
      })(),
      status: o.statusName,
      daysLate: o.daysLate,
    }));
  }, [lateOrders]);

  return (
    <div className="h-full rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-3 dark:border-[#1d2939] dark:from-white/[0.05] dark:to-transparent shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="dark:text-white text-gray-900 font-medium">Late / At-risk Orders</span>
        <ViewMoreButton path="/orders" />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-gray-500">
              <th className="text-center p-2">Order</th>
              <th className="text-center p-2">Client</th>
              <th className="text-center p-2">Due date</th>
              <th className="text-center p-2">Status</th>
              <th className="text-center p-2">Days late</th>
            </tr>
          </thead>
          <tbody>
            {(!lateOrders || lateOrders?.length === 0) && loading ? (
              Array?.from({ length: 5 })?.map((_, i) => (
                <tr key={i} className="border-t border-gray-100 dark:border-[#1d2939]">
                  <td className="p-2" colSpan={6}>
                    <div className="animate-pulse h-6 bg-gray-100 dark:bg-white/[0.06] rounded" />
                  </td>
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr className="border-t border-gray-100 dark:border-[#1d2939]">
                <td className="p-2 text-gray-500" colSpan={6}>No late orders</td>
              </tr>
            ) : (
              rows?.map((r) => (
                <tr key={r.id} className="border-t border-gray-100 dark:border-[#1d2939] hover:bg-gray-50/60 dark:hover:bg-white/[0.03]">
                  <td className="p-2 dark:text-white text-gray-900 font-medium text-center">{r.orderName}</td>
                  <td className="p-2 text-gray-500 text-center">{r.client}</td>
                  <td className="p-2 text-gray-500 text-center">{r.dueDate}</td>
                  <td className="p-2 text-center">
                    <span className="px-2 py-1 rounded-full text-xs bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200 dark:bg-white/[0.06] dark:text-yellow-300 dark:ring-white/10">
                      {r.status}
                    </span>
                  </td>
                  <td className="p-2 text-red-600 font-medium text-center">{r.daysLate}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LateOrdersTable;


