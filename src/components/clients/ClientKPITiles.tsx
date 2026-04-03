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
      <div className="group bg-blue-950/40 rounded-2xl p-6 border border-blue-800/30 cursor-default transition-all hover:opacity-95">
        <div className="flex items-center justify-between mb-2">
          <span className="text-blue-400 text-sm font-medium">Total Clients</span>
          <i className="ri-building-line text-3xl text-blue-400 w-10 h-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-125"></i>
        </div>
        <div className="text-3xl font-bold text-white">{clientKpiData.totalClients}</div>
      </div>

      <div className="group bg-emerald-950/40 rounded-2xl p-6 border border-emerald-800/30 cursor-default transition-all hover:opacity-95">
        <div className="flex items-center justify-between mb-2">
          <span className="text-emerald-400 text-sm font-medium">Active</span>
          <i className="ri-checkbox-circle-line text-3xl text-emerald-400 w-10 h-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-125"></i>
        </div>
        <div className="text-3xl font-bold text-white">{clientKpiData.activeClients}</div>
      </div>

      <div className="group bg-slate-800/60 rounded-2xl p-6 border border-slate-700/50 cursor-default transition-all hover:opacity-95">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-sm font-medium">Inactive</span>
          <i className="ri-close-circle-line text-3xl text-slate-400 w-10 h-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-125"></i>
        </div>
        <div className="text-3xl font-bold text-white">{clientKpiData.inactiveClients}</div>
      </div>

      <div className="group bg-purple-950/40 rounded-2xl p-6 border border-purple-800/30 cursor-default transition-all hover:opacity-95">
        <div className="flex items-center justify-between mb-2">
          <span className="text-purple-400 text-sm font-medium">New This Month</span>
          <i className="ri-user-add-line text-3xl text-purple-400 w-10 h-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-125"></i>
        </div>
        <div className="text-3xl font-bold text-white">{clientKpiData.newThisMonth}</div>
      </div>

      <div className="group bg-teal-950/40 rounded-2xl p-6 border border-teal-800/30 cursor-default transition-all hover:opacity-95">
        <div className="flex items-center justify-between mb-2">
          <span className="text-teal-400 text-sm font-medium">Total Revenue</span>
          <i className="ri-money-dollar-circle-line text-3xl text-teal-400 w-10 h-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-125"></i>
        </div>
        <div className="text-3xl font-bold text-white">
          ${(clientKpiData.totalRevenue / 1000).toFixed(0)}K
        </div>
      </div>
    </div>
  );
};

export default ClientKPITiles;
