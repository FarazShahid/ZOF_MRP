"use client";

import React, { useEffect, useMemo, useRef } from "react";
import ViewMoreButton from "./ViewMoreButton";
import useDashboardReportsStore from "@/store/useDashboardReportsStore";
import { FiShoppingCart, FiClock, FiCheckCircle, FiUser } from "react-icons/fi";
import { useRouter } from "next/navigation";

const TopClientsWidget: React.FC = () => {
  const topClients = useDashboardReportsStore((s) => s.topClients);
  const loading = useDashboardReportsStore((s) => s.loading);
  const fetchTopClients = useDashboardReportsStore((s) => s.fetchTopClients);
  
  const router = useRouter();
  const hasRequested = useRef(false);
  
  useEffect(() => {
    if (!hasRequested.current && (!topClients || topClients?.length === 0) && !loading) {
      hasRequested.current = true;
      fetchTopClients();
    }
  }, [topClients, loading, fetchTopClients]);

  const clients = useMemo(
    () =>
      (topClients ?? [])?.map((c) => ({
        id: c.clientId,
        name: c.clientName,
        orders: c.orderCount,
        pending: c.pendingOrders,
        completed: c.completedOrders,
      })),
    [topClients]
  );
  return (
    <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-3 dark:border-[#1d2939] dark:from-white/[0.05] dark:to-transparent shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-gray-900 font-medium">Top clients</span>
        <ViewMoreButton path="/client" />
      </div>
      <div className="flex flex-col gap-2 h-[290px] overflow-x-auto p-2">
        {(!topClients || topClients?.length === 0) && loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-gray-100 p-3 ring-1 ring-gray-200/60 dark:bg-white/[0.06] dark:ring-white/10">
              <div className="w-40 h-4 bg-gray-200 dark:bg-white/10 rounded animate-pulse mb-2" />
              <div className="flex items-center gap-2">
                <div className="w-16 h-4 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
                <div className="w-16 h-4 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
                <div className="w-16 h-4 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
              </div>
            </div>
          ))
        ) : (
          clients?.map((c) => (
            <div
              key={c.id}
              onClick={() => router.push(`/client/${c.id}`)}
              className="rounded-2xl bg-gray-100 p-3 ring-1 ring-gray-200/60 dark:bg-white/[0.06] dark:ring-white/10 transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-gray-200/80 dark:bg-white/10 text-gray-900">
                  <FiUser />
                </span>
                <p className="dark:text-white text-gray-900 font-medium truncate">{c.name}</p>
              </div>
              <div className=" flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-gray-200/70 text-gray-900 dark:bg-white/10">
                  <FiShoppingCart className="text-[12px]" /> {c.orders} total
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 ring-1 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/20">
                  <FiClock className="text-[12px]" /> {c.pending} pending
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/20">
                  <FiCheckCircle className="text-[12px]" /> {c.completed} completed
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TopClientsWidget;


