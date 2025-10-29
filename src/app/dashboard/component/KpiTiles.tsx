"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { AiFillProduct } from "react-icons/ai";
import { FiPackage, FiShoppingCart, FiUsers } from "react-icons/fi";
import Widget from "./Widget";
import useDashboardReportsStore from "@/store/useDashboardReportsStore";

const KpiTiles: React.FC = () => {
  const widgets = useDashboardReportsStore((s) => s.widgets);
  const loading = useDashboardReportsStore((s) => s.loading);
  const fetchWidgets = useDashboardReportsStore((s) => s.fetchWidgets);

  const hasRequested = useRef(false);
  useEffect(() => {
    if (!hasRequested.current && !widgets && !loading) {
      hasRequested.current = true;
      fetchWidgets();
    }
  }, [widgets, loading, fetchWidgets]);

  const data = useMemo(
    () => [
      {
        icon: <FiShoppingCart />,
        title: "orders",
        number: widgets?.totalOrders?.toLocaleString?.() ?? "-",
        href: "/orders",
      },
      {
        icon: <AiFillProduct />,
        title: "active products",
        number: widgets?.totalProducts?.toLocaleString?.() ?? "-",
        href: "/product",
      },
      {
        icon: <FiPackage />,
        title: "shipments",
        number: widgets?.totalShipments?.toLocaleString?.() ?? "-",
        href: "/shipment",
      },
      {
        icon: <FiUsers />,
        title: "active clients",
        number: widgets?.totalClients?.toLocaleString?.() ?? "-",
        href: "/adminsetting",
      },
    ],
    [widgets]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {(!widgets && loading) ? (
        Array?.from({ length: 4 })?.map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-4 dark:border-[#1d2939] dark:from-white/[0.05] dark:to-transparent shadow-sm animate-pulse h-[116px]" />
        ))
      ) : (
        data?.map((d, i) => (
          <Widget key={i} icon={d.icon} title={d.title} number={d.number} href={d.href} />
        ))
      )}
    </div>
  );
};

export default KpiTiles;


