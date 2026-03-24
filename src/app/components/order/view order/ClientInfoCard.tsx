"use client";

import useClientStore from "@/store/useClientStore";
import React, { FC, useEffect } from "react";

interface ClientDetailsProp {
  clientId: number;
}

const getInitials = (name: string) => {
  if (!name || !name.trim()) return "—";
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const ClientInfoCard: FC<ClientDetailsProp> = ({ clientId }) => {
  const { loading, clientById, getClientById } = useClientStore();

  useEffect(() => {
    if (clientId > 0) {
      getClientById(clientId);
    }
  }, [clientId]);

  if (!clientId || clientId <= 0) return null;

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <i className="ri-building-line text-white w-4 h-4 flex items-center justify-center" />
        </div>
        <h2 className="text-lg font-bold text-white">Client Info</h2>
      </div>

      {loading && !clientById ? (
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-slate-800 rounded-lg" />
          <div className="h-4 bg-slate-800 rounded w-3/4" />
          <div className="h-4 bg-slate-800 rounded w-1/2" />
        </div>
      ) : clientById ? (
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">
              {getInitials(clientById.Name ?? "")}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-semibold">
              {clientById.Name ?? "—"}
            </div>
            <div className="text-slate-400 text-xs mt-0.5">
              {[clientById.POCName, clientById.POCEmail ?? clientById.Email]
                .filter(Boolean)
                .join(" · ") || "—"}
            </div>
            {(clientById.Phone || clientById.CompleteAddress) && (
              <div className="mt-3 space-y-1.5 text-xs">
                {clientById.Phone && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <i className="ri-phone-line w-3.5 h-3.5 flex items-center justify-center text-slate-500" />
                    {clientById.Phone}
                  </div>
                )}
                {clientById.CompleteAddress && (
                  <div className="flex items-start gap-2 text-slate-400">
                    <i className="ri-map-pin-line w-3.5 h-3.5 flex items-center justify-center text-slate-500 shrink-0 mt-0.5" />
                    <span>{clientById.CompleteAddress}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-500">Client not found</p>
      )}
    </div>
  );
};

export default ClientInfoCard;
