"use client";
import React, { useEffect, useMemo, useRef } from "react";
import { FiShoppingCart, FiPackage } from "react-icons/fi";
import ProductSkeleton from "./ProductSkeleton";
import ViewMoreButton from "./ViewMoreButton";
import useDashboardReportsStore from "@/store/useDashboardReportsStore";

const ProductWidget = () => {
  const topProducts = useDashboardReportsStore((s) => s.topProducts);
  const storeLoading = useDashboardReportsStore((s) => s.loading);
  const fetchTopProducts = useDashboardReportsStore((s) => s.fetchTopProducts);

  const hasRequested = useRef(false);
  useEffect(() => {
    if (!hasRequested.current && (!topProducts || topProducts.length === 0) && !storeLoading) {
      hasRequested.current = true;
      fetchTopProducts();
    }
  }, [topProducts, storeLoading, fetchTopProducts]);
  const colors = ["#e5e7eb", "#86efac", "#93c5fd", "#fca5a5", "#fde68a"]; // light gray, green, blue, red, yellow

  const products = useMemo(() => {
    return (topProducts ?? [])?.map((p, idx) => ({
      id: p.productId,
      name: p.productName,
      orderCount: p.orderCount,
      totalQty: p.totalQuantity,
      type: `${p.orderCount?.toLocaleString?.() ?? p.orderCount} orders`,
      qtyLabel: `${p.totalQuantity?.toLocaleString?.() ?? p.totalQuantity} qty`,
      color: colors[idx % colors.length],
    }));
  }, [topProducts]);

  const maxQty = useMemo(() => {
    const values = products?.map((p) => Number(p.totalQty) || 0);
    return values.length ? Math.max(...values) : 0;
  }, [products]);

  const topFive = useMemo(() => {
    return [...products]
      .sort((a, b) => (Number(b.totalQty) || 0) - (Number(a.totalQty) || 0))
      .slice(0, 5);
  }, [products]);

  const isLoading = (storeLoading && (!topProducts || topProducts?.length === 0));
  return (
    <div className=" border border-gray-200 bg-white p-3 dark:border-[#1d2939] dark:bg-white/[0.03] shadow-md space-y-3 rounded-2xl">
      <div className="flex items-center justify-between">
        <span className="dark:text-white text-gray-800">Top products</span>
        <ViewMoreButton path="/product" />
      </div>
      <div className="space-y-2 h-[290px] overflow-x-auto px-2">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
          </div>
        ) : (
          topFive.map((item, idx) => {
            return (
              <div
                className="mt-2 bg-gray-100 dark:bg-[#353535] w-full rounded-2xl p-3 flex items-center gap-4 ring-1 ring-gray-200/60 dark:ring-white/10 transition-all hover:shadow-md hover:-translate-y-0.5"
                key={item.id}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center ring-1 ring-gray-200/60 dark:ring-white/10 text-gray-800 dark:text-white text-lg font-semibold shrink-0"
                  style={{ backgroundColor: item.color }}
                  aria-hidden
                >
                  {item.name?.[0] ?? "P"}
                </div>
                <div className="flex flex-col gap-2 w-full min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <h6 className="dark:text-white text-gray-800 text-base font-medium truncate">{item.name}</h6>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-200/70 text-gray-700 dark:bg-white/10 dark:text-gray-300">#{idx + 1}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-gray-200/70 text-gray-800 dark:bg-white/10 dark:text-gray-200">
                      <FiShoppingCart className="text-[12px]" /> {item.type}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 ring-1 ring-blue-200 dark:bg-blue-400/10 dark:text-blue-300 dark:ring-blue-400/20">
                      <FiPackage className="text-[12px]" /> {item.qtyLabel}
                    </span>
                  </div>
                  {maxQty > 0 ? (
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-gray-500">relative volume</span>
                        <span className="text-[11px] text-gray-700 dark:text-gray-300">
                          {Math.max(1, Math.round((Number(item.totalQty) / maxQty) * 100))}%
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 w-full rounded bg-gray-200 dark:bg-white/10">
                        <div
                          className="h-full rounded bg-blue-500"
                          style={{ width: `${Math.max(4, Math.min(100, Math.round((Number(item.totalQty) / maxQty) * 100)))}%` }}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="ml-auto text-right shrink-0">
                  <div className="text-sm dark:text-white text-gray-900 font-semibold leading-tight">
                    {item.orderCount?.toLocaleString?.() ?? item.orderCount}
                  </div>
                  <div className="text-[11px] text-gray-500">orders</div>
                  <div className="text-sm dark:text-white text-gray-900 font-semibold leading-tight mt-1">
                    {item.totalQty?.toLocaleString?.() ?? item.totalQty}
                  </div>
                  <div className="text-[11px] text-gray-500">qty</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProductWidget;
