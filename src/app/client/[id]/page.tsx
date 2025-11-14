"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import AdminDashboardLayout from "@/src/app/components/common/AdminDashboardLayout";
import useClientStore from "@/store/useClientStore";
import useOrderStore from "@/store/useOrderStore";
import useProductStore from "@/store/useProductStore";
import ClientHeader from "@/src/app/components/admin/customers/ClientHeader";
import ClientInfoCard from "@/src/app/components/admin/customers/ClientInfoCard";
import TabsNav, { TabType } from "@/src/app/components/admin/customers/TabsNav";
import OverviewTab from "@/src/app/components/admin/customers/OverviewTab";
import OrdersTab from "@/src/app/components/admin/customers/OrdersTab";
import ProductsTab from "@/src/app/components/admin/customers/ProductsTab";

const ClientProfilePage = () => {
  const params = useParams<{ id: string }>();
  const clientId = Number(params?.id);
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  const { clientById, getClientById, loading: clientLoading } = useClientStore();
  const { Orders: allOrders = [], fetchOrders, loading: ordersLoading } = useOrderStore();
  const { products, getProductByClientId } = useProductStore();
  
  // Filter orders for this specific client
  const Orders = useMemo(
    () => allOrders.filter((order) => order.ClientId === clientId),
    [allOrders, clientId]
  );

  const activeProductsCount = useMemo(
    () => products.filter((p) => p.productStatus === "Approved").length,
    [products]
  );
  const completedOrdersCount = useMemo(
    () => Orders.filter((o) => o.StatusName.toLowerCase().includes("completed")).length,
    [Orders]
  );

  useEffect(() => {
    if (Number.isFinite(clientId) && clientId > 0) {
      getClientById(clientId);
      getProductByClientId(clientId);
      fetchOrders(clientId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  // Use clientById from store instead of local state
  const client = clientById;

  if (clientLoading || !client) {
    return (
      <AdminDashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading client profile...</p>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <ClientHeader name={client.Name} />

        <ClientInfoCard client={client} />

        {/* Tabs */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <TabsNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            ordersCount={Orders.length}
            productsCount={products.length}
          />

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "overview" && (
              <OverviewTab
                client={client}
                ordersCount={Orders.length}
                activeProductsCount={activeProductsCount}
                completedOrdersCount={completedOrdersCount}
              />
            )}

            {activeTab === "orders" && (
              <OrdersTab orders={Orders} loading={ordersLoading} />
            )}

            {activeTab === "products" && (
              <ProductsTab products={products} />
            )}
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default ClientProfilePage;

