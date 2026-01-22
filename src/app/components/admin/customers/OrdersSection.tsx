"use client";

import React from "react";
import Link from "next/link";
import { GetOrdersType } from "@/src/app/interfaces/OrderStoreInterface";
import { ClipboardList } from "lucide-react";

const OrdersSection: React.FC<{ orders: GetOrdersType[]; loading: boolean }> = ({ orders, loading }) => {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Orders</h4>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" />
              Loading…
            </span>
          ) : (
            <span className="inline-flex items-center gap-1">
              <ClipboardList className="w-3.5 h-3.5" />
              {orders.length} found
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-slate-800/30 animate-pulse"
            />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-sm text-gray-500 dark:text-gray-400">No orders found for this project.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {orders.map((o) => (
            <div
              key={o.Id}
              className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-gray-50/60 dark:bg-slate-800/30"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-medium truncate">{o.OrderName || o.OrderNumber}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">#{o.OrderNumber}</div>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                    {o.StatusName ? (
                      <span className="px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700">
                        {o.StatusName}
                      </span>
                    ) : null}
                    {o.Deadline ? (
                      <span className="px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700">
                        {String(o.Deadline).slice(0, 10)}
                      </span>
                    ) : null}
                  </div>
                </div>

                <Link
                  href={`/orders/vieworder/${o.Id}`} // adjust to your actual route
                  className="shrink-0 text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800"
                >
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default OrdersSection;
