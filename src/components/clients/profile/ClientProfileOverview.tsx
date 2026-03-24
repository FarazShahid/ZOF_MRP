"use client";

import React from "react";
import { GetClientsType } from "@/store/useClientStore";

interface ClientProfileOverviewProps {
  client: GetClientsType;
  ordersCount: number;
  productsCount: number;
  completedOrdersCount: number;
  projectsCount: number;
  onTabChange?: (tab: "orders" | "products" | "programs") => void;
}

export default function ClientProfileOverview({
  client,
  ordersCount,
  productsCount,
  completedOrdersCount,
  projectsCount,
  onTabChange,
}: ClientProfileOverviewProps) {
  const statusLabel = client.ClientStatusId === "1" ? "Active" : "Inactive";

  return (
    <div className="space-y-6">
      {/* KPI Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => onTabChange?.("orders")}
          className="text-left bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 border border-blue-500/20 hover:opacity-90 transition-opacity cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-100 text-sm font-medium">Total Orders</span>
            <i className="ri-shopping-bag-line text-2xl text-blue-200 w-8 h-8 flex items-center justify-center"></i>
          </div>
          <div className="text-3xl font-bold text-white">{ordersCount}</div>
        </button>

        <button
          onClick={() => onTabChange?.("products")}
          className="text-left bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 border border-purple-500/20 hover:opacity-90 transition-opacity cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-100 text-sm font-medium">Total Products</span>
            <i className="ri-t-shirt-line text-2xl text-purple-200 w-8 h-8 flex items-center justify-center"></i>
          </div>
          <div className="text-3xl font-bold text-white">{productsCount}</div>
        </button>

        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 border border-green-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-100 text-sm font-medium">Shipped Orders</span>
            <i className="ri-truck-line text-2xl text-green-200 w-8 h-8 flex items-center justify-center"></i>
          </div>
          <div className="text-3xl font-bold text-white">{completedOrdersCount}</div>
        </div>

        <button
          onClick={() => onTabChange?.("programs")}
          className="text-left bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 border border-teal-500/20 hover:opacity-90 transition-opacity cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-teal-100 text-sm font-medium">Programs/Events</span>
            <i className="ri-calendar-check-line text-2xl text-teal-200 w-8 h-8 flex items-center justify-center"></i>
          </div>
          <div className="text-3xl font-bold text-white">{projectsCount}</div>
        </button>
      </div>

      {/* Client Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Client Information</h3>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-slate-500 mb-1">Business Name</div>
              <div className="text-sm text-slate-300">{client.Name}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Website</div>
              <div className="text-sm text-blue-400">
                {client.Website ? (
                  <a
                    href={client.Website.startsWith("http") ? client.Website : `https://${client.Website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {client.Website}
                  </a>
                ) : (
                  "-"
                )}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Address</div>
              <div className="text-sm text-slate-300">
                {client.CompleteAddress || "-"}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Status</div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${
                  client.ClientStatusId === "1"
                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                    : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                }`}
              >
                {statusLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Primary Contact</h3>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-slate-500 mb-1">Name</div>
              <div className="text-sm text-slate-300">{client.POCName || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Email</div>
              <div className="text-sm text-slate-300">
                {client.POCEmail || client.Email || "-"}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Phone</div>
              <div className="text-sm text-slate-300">{client.Phone || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Member Since</div>
              <div className="text-sm text-slate-300">
                {client.CreatedOn
                  ? new Date(client.CreatedOn).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "-"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
