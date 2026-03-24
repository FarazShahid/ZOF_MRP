"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Events } from "@/store/useEventsStore";

interface EventDetailHeaderProps {
  event: Events;
  ordersCount: number;
  productsCount: number;
}

export default function EventDetailHeader({
  event,
  ordersCount,
  productsCount,
}: EventDetailHeaderProps) {
  const router = useRouter();

  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-white">{event.EventName}</h1>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-400 mb-4">
            <span className="flex items-center gap-1.5">
              <i className="ri-building-line w-4 h-4 flex items-center justify-center"></i>
              {event.ClientName || "-"}
            </span>
            <span className="flex items-center gap-1.5">
              <i className="ri-calendar-line w-4 h-4 flex items-center justify-center"></i>
              {event.CreatedOn
                ? new Date(event.CreatedOn).toLocaleDateString("en-US")
                : "-"}
            </span>
          </div>
          {event.Description && (
            <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
              {event.Description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 ml-6 shrink-0">
          <button
            onClick={() =>
              router.push(`/orders/addorder?clientId=${event.ClientId}&eventId=${event.Id}`)
            }
            className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-add-line mr-1.5 w-4 h-4 inline-flex items-center justify-center"></i>
            Add Order
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">Total Orders</div>
          <div className="text-xl font-bold text-white">{ordersCount}</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">Linked Products</div>
          <div className="text-xl font-bold text-white">{productsCount}</div>
        </div>
      </div>
    </div>
  );
}
