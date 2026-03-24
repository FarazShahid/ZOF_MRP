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
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{client.Name}</h1>
        <div className="flex items-center gap-4 text-sm text-slate-400">
          <span>#{client.Id}</span>
          <span>•</span>
          <span>{client.POCName || "-"}</span>
          <span>•</span>
          <span>{client.POCEmail || client.Email || "-"}</span>
          <span>•</span>
          <span
            className={`${
              client.ClientStatusId === "1"
                ? "text-green-400"
                : "text-gray-400"
            }`}
          >
            {statusLabel}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push(`/orders/addorder?clientId=${clientId}`)}
          className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-shopping-cart-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>
          Add Order
        </button>
        <button
          onClick={() =>
            router.push(`/product/productform?clientId=${clientId}`)
          }
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-t-shirt-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>
          Add Product
        </button>
        <button
          onClick={() => router.push(`/events`)}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium text-sm transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-calendar-event-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>
          Add Event
        </button>
      </div>
    </div>
  );
}
