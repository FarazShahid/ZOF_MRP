"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminDashboardLayout from "@/src/app/components/common/AdminDashboardLayout";
import useClientStore from "@/store/useClientStore";
import useOrderStore from "@/store/useOrderStore";
import useProductStore from "@/store/useProductStore";
import ClientHeader from "@/src/app/components/admin/customers/ClientHeader";
import ClientInfoCard from "@/src/app/components/admin/customers/ClientInfoCard";
import TabsNav, { TabType } from "@/src/app/components/admin/customers/TabsNav";
import OverviewTab from "@/src/app/components/admin/customers/OverviewTab";
import OrdersTab from "@/src/app/components/admin/customers/OrdersTab";
import ProjectsTab from "@/src/app/components/admin/customers/ProjectsTab";
import ProductsTab from "@/src/app/components/admin/customers/ProductsTab";
import { OrderStatusEnum } from "@/src/types/admin";
import { Plus, ClipboardList, PackageOpen, ShoppingCart } from "lucide-react";
import AddProjectModal from "@/src/app/components/admin/customers/AddProjectModal";

const ClientProfilePage = () => {
  const params = useParams<{ id: string }>();
  const clientId = Number(params?.id);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isProjectModalOpen, setIsProjectModalOpen] = useState<boolean>(false);
  const router = useRouter();

  const { clientById, getClientById, loading: clientLoading, projects, fetchProjects } = useClientStore();
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
    () => Orders.filter((o) => o.StatusName.includes(OrderStatusEnum.Shipped)).length,
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

  // Load projects only when Projects tab is active
  useEffect(() => {
    if (activeTab === "projects") {
      fetchProjects();
      if (Number.isFinite(clientId) && clientId > 0) {
        getProductByClientId(clientId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

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
        <div className="flex items-start justify-between gap-4">
          <ClientHeader name={client.Name} />
          {/* Dynamic header action button */}
          {activeTab === "projects" && (
            <button
              className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm h-[36px] shadow-sm hover:bg-blue-700 transition-colors"
              onClick={() => setIsProjectModalOpen(true)}
            >
              <Plus className="w-4 h-4" /> Create New Project
            </button>
          )}
          {activeTab === "orders" && (
            <button
              className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm h-[36px] shadow-sm hover:bg-blue-700 transition-colors"
              onClick={() => router.push("/orders/addorder")}
            >
              <ShoppingCart className="w-4 h-4" /> Create New Order
            </button>
          )}
          {activeTab === "products" && (
            <button
              className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm h-[36px] shadow-sm hover:bg-blue-700 transition-colors"
              onClick={() => router.push("/product/productform")}
            >
              <PackageOpen className="w-4 h-4" /> Create New Product
            </button>
          )}
        </div>

        <ClientInfoCard client={client} />

        {/* Tabs */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <TabsNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            ordersCount={Orders.length}
            productsCount={products.length}
            projectsCount={projects.filter((p) => p.ClientId === clientId).length}
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

            {activeTab === "projects" && (
              <ProjectsTab clientId={clientId} products={products} orders={Orders} />
            )}
          </div>
        </div>

        {/* Project Modal (opened from header button) */}
        <AddProjectModal
          isOpen={isProjectModalOpen}
          onClose={() => setIsProjectModalOpen(false)}
          clientId={clientId}
        />
      </div>
    </AdminDashboardLayout>
  );
};

export default ClientProfilePage;

