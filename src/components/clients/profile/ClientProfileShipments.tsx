"use client";

import React from "react";
import { GetAllShipments } from "@/store/useShipmentStore";

interface ClientProfileShipmentsProps {
  shipments: GetAllShipments[];
}

export default function ClientProfileShipments({
  shipments,
}: ClientProfileShipmentsProps) {
  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("delivered")) return "bg-green-500/20 text-green-400 border-green-500/30";
    if (s.includes("transit")) return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">Shipments</h2>
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        {shipments.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-400">
            No shipments yet
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Shipment Code
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Order
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Carrier
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Ship Date
                </th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((shipment) => (
                <tr
                  key={shipment.Id}
                  className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-white">
                    {shipment.ShipmentCode}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">
                    {shipment.OrderNumber || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">
                    {shipment.ShipmentCarrierName || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getStatusColor(
                        shipment.Status
                      )}`}
                    >
                      {shipment.Status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">
                    {shipment.ShipmentDate
                      ? new Date(shipment.ShipmentDate).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
