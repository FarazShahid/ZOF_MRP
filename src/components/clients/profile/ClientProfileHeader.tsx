"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { GetClientsType } from "@/store/useClientStore";

interface ClientProfileHeaderProps {
  client: GetClientsType;
  clientId: number;
}

export default function ClientProfileHeader({ client, clientId }: ClientProfileHeaderProps) {
  const router = useRouter();
  const statusLabel = client.ClientStatusId === "1" ? "Active" : "Inactive";

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 px-6 py-4 rounded-lg mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/client")}
            className="group p-2 hover:px-4 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-700 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white rounded-lg transition-all duration-300 ease-in-out cursor-pointer"
          >
            <i className="ri-arrow-left-line text-lg w-5 h-5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"></i>
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{client.Name}</h1>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  client.ClientStatusId === "1"
                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                    : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                }`}
              >
                {statusLabel}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-slate-400 mt-0.5">
              <span>#{client.Id}</span>
              <span>&middot;</span>
              <span>{client.POCName || "-"}</span>
              <span>&middot;</span>
              <span>{client.POCEmail || client.Email || "-"}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/orders/addorder?clientId=${clientId}`)}
            className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium text-sm transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-shopping-cart-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>
            Add Order
          </button>
          <button
            onClick={() =>
              router.push(`/product/productform?clientId=${clientId}`)
            }
            className="px-5 py-2.5 bg-slate-800/70 hover:bg-slate-700 text-white rounded-xl font-medium text-sm transition-colors cursor-pointer whitespace-nowrap border border-slate-700/60 hover:border-slate-600"
          >
            <i className="ri-t-shirt-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>
            Add Product
          </button>
          <button
            onClick={() => router.push(`/events`)}
            className="px-5 py-2.5 bg-slate-800/70 hover:bg-slate-700 text-white rounded-xl font-medium text-sm transition-colors cursor-pointer whitespace-nowrap border border-slate-700/60 hover:border-slate-600"
          >
            <i className="ri-calendar-event-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>
            Add Event
          </button>
        </div>
      </div>
    </div>
  );
}
