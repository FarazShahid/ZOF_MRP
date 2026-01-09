"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/store/useProductStore";

const ProductsSection: React.FC<{ products: Product[]; loading: boolean }> = ({ products, loading }) => {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Products</h4>
        {loading ? (
          <span className="text-xs text-gray-500">Loading…</span>
        ) : (
          <span className="text-xs text-gray-500">{products.length} item(s)</span>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-slate-800/30 animate-pulse"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-sm text-gray-500 dark:text-gray-400">No products linked to this project.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {products.map((p) => (
            <div
              key={p.Id}
              className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-gray-50/60 dark:bg-slate-800/30"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-medium truncate" title={p.Name}>
                    {p.Name}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    {p.ProductCategoryName ? (
                      <span className="px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700">
                        {p.ProductCategoryName}
                      </span>
                    ) : null}
                    {p.FabricName ? (
                      <span className="px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700">
                        {p.FabricName}
                      </span>
                    ) : null}
                    {p.productStatus ? (
                      <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-200/60 dark:border-green-800/60">
                        {p.productStatus}
                      </span>
                    ) : null}
                  </div>
                </div>

                <Link
                  href={`/product/${p.Id}`}
                  className="shrink-0 text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800"
                >
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductsSection;
