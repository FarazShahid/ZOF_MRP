"use client";
import React, { useEffect, useMemo, useRef } from "react";
import { FiShoppingCart } from "react-icons/fi";
import ProductSkeleton from "./ProductSkeleton";
import ViewMoreButton from "./ViewMoreButton";
import useDashboardReportsStore from "@/store/useDashboardReportsStore";
import { useRouter } from "next/navigation";

const ProductWidget = () => {
  const router = useRouter();

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
  const colorSchemes = [
    { bg: "#6b7280", text: "#ffffff" }, // gray
    { bg: "#16a34a", text: "#ffffff" }, // green
    { bg: "#2563eb", text: "#ffffff" }, // blue
    { bg: "#dc2626", text: "#ffffff" }, // red
    { bg: "#ca8a04", text: "#ffffff" }, // yellow
  ];

  const products = useMemo(() => {
    return (topProducts ?? [])?.map((p, idx) => ({
      id: p.productId,
      name: p.productName,
      orderCount: p.orderCount,
      totalQty: p.totalQuantity,
      type: `${p.orderCount?.toLocaleString?.() ?? p.orderCount} orders`,
      qtyLabel: `${p.totalQuantity?.toLocaleString?.() ?? p.totalQuantity} qty`,
      scheme: colorSchemes[idx % colorSchemes.length],
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
      <div className="flex flex-col gap-2 h-[290px] overflow-x-auto p-2">
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
                className=" bg-gray-100 dark:bg-[#353535] w-full rounded-2xl p-3 flex items-center gap-4 ring-1 ring-gray-200/60 dark:ring-white/10 transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                key={item.id}
                onClick={() => router.push(`/product/${item.id}`)}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center ring-1 ring-gray-200/60 dark:ring-white/10 text-lg font-semibold shrink-0"
                  style={{ backgroundColor: item.scheme.bg, color: item.scheme.text }}
                  aria-hidden
                >
                  {item.name?.[0] ?? "P"}
                </div>
                <div className="flex flex-col gap-2 w-full min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <h6 className="dark:text-white text-gray-800 text-base font-medium truncate">{item.name}</h6>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 ring-1 ring-teal-100 dark:bg-teal-500/10 dark:text-teal-300 dark:ring-teal-500/20">
                      <FiShoppingCart className="text-[12px]" /> {item.type}
                    </span>
                  </div>
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
