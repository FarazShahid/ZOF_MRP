"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/store/useProductStore";

interface ClientProfileProductsProps {
  products: Product[];
}

export default function ClientProfileProducts({ products }: ClientProfileProductsProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">Products</h2>
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        {products.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-400">
            No products yet
          </div>
        ) : (
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
                  GSM
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Created
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
                      className="hover:text-blue-400 transition-colors"
                    >
                      <div>
                        <div className="text-sm font-medium text-white">
                          {product.Name}
                        </div>
                        <div className="text-xs text-slate-500">{product.Id}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">
                    {product.ProductCategoryName}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">
                    {product.FabricName}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">
                    {product.GSM || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${
                        product.productStatus === "Approved"
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : product.productStatus === "Sample"
                          ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                          : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                      }`}
                    >
                      {product.productStatus || "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">
                    {new Date(product.CreatedOn).toLocaleDateString()}
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
