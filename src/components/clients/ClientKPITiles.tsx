"use client";

import React from "react";

export interface ClientKPIData {
  totalClients: number;
  activeClients: number;
  inactiveClients: number;
  newThisMonth: number;
  totalRevenue: number;
}

interface ClientKPITilesProps {
  clientKpiData: ClientKPIData;
}

const ClientKPITiles: React.FC<ClientKPITilesProps> = ({ clientKpiData }) => {
  return (
    <div className="grid grid-cols-5 gap-4 mb-8">
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 border border-blue-500/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-blue-100 text-sm font-medium">Total Clients</span>
          <i className="ri-building-line text-2xl text-blue-200 w-8 h-8 flex items-center justify-center"></i>
        </div>
        <div className="text-3xl font-bold text-white">{clientKpiData.totalClients}</div>
      </div>

      <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 border border-green-500/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-green-100 text-sm font-medium">Active</span>
          <i className="ri-checkbox-circle-line text-2xl text-green-200 w-8 h-8 flex items-center justify-center"></i>
        </div>
        <div className="text-3xl font-bold text-white">{clientKpiData.activeClients}</div>
      </div>

      <div className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl p-6 border border-gray-500/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-100 text-sm font-medium">Inactive</span>
          <i className="ri-close-circle-line text-2xl text-gray-200 w-8 h-8 flex items-center justify-center"></i>
        </div>
        <div className="text-3xl font-bold text-white">{clientKpiData.inactiveClients}</div>
      </div>

      <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 border border-purple-500/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-purple-100 text-sm font-medium">New This Month</span>
          <i className="ri-user-add-line text-2xl text-purple-200 w-8 h-8 flex items-center justify-center"></i>
        </div>
        <div className="text-3xl font-bold text-white">{clientKpiData.newThisMonth}</div>
      </div>

      <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 border border-teal-500/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-teal-100 text-sm font-medium">Total Revenue</span>
          <i className="ri-money-dollar-circle-line text-2xl text-teal-200 w-8 h-8 flex items-center justify-center"></i>
        </div>
        <div className="text-3xl font-bold text-white">
          ${(clientKpiData.totalRevenue / 1000).toFixed(0)}K
        </div>
      </div>
    </div>
  );
};

export default ClientKPITiles;
