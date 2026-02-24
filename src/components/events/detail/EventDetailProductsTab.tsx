"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/store/useProductStore";

interface EventDetailProductsTabProps {
  products: Product[];
}

function getStatusColor(status: string) {
  const s = status?.toLowerCase() || "";
  if (s === "approved") return "bg-green-500/20 text-green-400 border-green-500/30";
  if (s === "sample") return "bg-blue-500/20 text-blue-400 border-blue-500/30";
  return "bg-gray-500/20 text-gray-400 border-gray-500/30";
}

export default function EventDetailProductsTab({
  products,
}: EventDetailProductsTabProps) {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
      {products.length === 0 ? (
        <div className="px-6 py-12 text-center text-slate-400">
          No products linked to this event. Products are linked through orders.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Product
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Fabric
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.Id}
                  className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/product/${product.Id}`}
                      className="text-sm font-medium text-white hover:text-blue-400 transition-colors"
                    >
                      <div>{product.Name}</div>
                      <div className="text-xs text-slate-500">{product.Id}</div>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">
                    {product.ProductCategoryName}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">
                    {product.FabricName}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getStatusColor(
                        product.productStatus || ""
                      )}`}
                    >
                      {product.productStatus || "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/product/${product.Id}`}
                      className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer inline-block"
                      title="View Product"
                    >
                      <i className="ri-eye-line w-4 h-4 flex items-center justify-center"></i>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
