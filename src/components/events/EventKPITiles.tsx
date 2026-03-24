"use client";

import React from "react";

interface EventKPIData {
  totalEvents: number;
  withOrders: number;
  uniqueClients: number;
  newThisMonth: number;
}

interface EventKPITilesProps {
  eventKpiData: EventKPIData;
}

export default function EventKPITiles({ eventKpiData }: EventKPITilesProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 border border-blue-500/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-blue-100 text-sm font-medium">Total Events</span>
          <i className="ri-calendar-event-line text-2xl text-blue-200 w-8 h-8 flex items-center justify-center"></i>
        </div>
        <div className="text-3xl font-bold text-white">{eventKpiData.totalEvents}</div>
      </div>

      <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 border border-green-500/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-green-100 text-sm font-medium">With Orders</span>
          <i className="ri-shopping-bag-line text-2xl text-green-200 w-8 h-8 flex items-center justify-center"></i>
        </div>
        <div className="text-3xl font-bold text-white">{eventKpiData.withOrders}</div>
      </div>

      <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 border border-teal-500/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-teal-100 text-sm font-medium">Unique Clients</span>
          <i className="ri-building-line text-2xl text-teal-200 w-8 h-8 flex items-center justify-center"></i>
        </div>
        <div className="text-3xl font-bold text-white">{eventKpiData.uniqueClients}</div>
      </div>

      <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 border border-purple-500/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-purple-100 text-sm font-medium">New This Month</span>
          <i className="ri-add-circle-line text-2xl text-purple-200 w-8 h-8 flex items-center justify-center"></i>
        </div>
        <div className="text-3xl font-bold text-white">{eventKpiData.newThisMonth}</div>
      </div>
    </div>
  );
}
