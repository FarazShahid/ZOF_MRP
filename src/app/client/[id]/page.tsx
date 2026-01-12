"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminDashboardLayout from "@/src/app/components/common/AdminDashboardLayout";
import useClientStore from "@/store/useClientStore";
import useOrderStore from "@/store/useOrderStore";
import useProductStore from "@/store/useProductStore";
import ClientHeader from "@/src/app/components/admin/customers/ClientHeader";
import ClientInfoCard from "@/src/app/components/admin/customers/ClientInfoCard";
import TabsNav, { TabType, TabActionButton } from "@/src/app/components/admin/customers/TabsNav";
import OverviewTab from "@/src/app/components/admin/customers/OverviewTab";
import OrdersTab from "@/src/app/components/admin/customers/OrdersTab";
import ProjectsTab from "@/src/app/components/admin/customers/ProjectsTab";
import ProductsTab from "@/src/app/components/admin/customers/ProductsTab";
import { OrderStatusEnum } from "@/src/types/admin";
import { Plus, PackageOpen, ShoppingCart } from "lucide-react";

const ClientProfilePage = () => {
  const params = useParams<{ id: string }>();
  const clientId = Number(params?.id);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [projectsActionButton, setProjectsActionButton] = useState<React.ReactNode>(null);
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

  const projectsCount = useMemo(
    () => projects.filter((p) => p.ClientId === clientId).length,
    [projects, clientId]
  );

  useEffect(() => {
    if (Number.isFinite(clientId) && clientId > 0) {
      getClientById(clientId);
      getProductByClientId(clientId);
      fetchOrders(clientId);
      fetchProjects(clientId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  const client = clientById;

  // Get action button for current tab
  const getActionButton = useCallback((): React.ReactNode => {
    switch (activeTab) {
      case "projects":
        return projectsActionButton;
      case "orders":
        return (
          <TabActionButton
            icon={ShoppingCart}
            label="Create New Order"
            onClick={() => router.push("/orders/addorder")}
          />
        );
      case "products":
        return (
          <TabActionButton
            icon={PackageOpen}
            label="Create New Product"
            onClick={() => router.push("/product/productform")}
          />
        );
      default:
        return null;
    }
  }, [activeTab, router, projectsActionButton]);

  // Only show loading on initial load when we don't have a client yet
  // Don't show loading for project operations (getProjectById sets loading too)
  if (!client && clientLoading && Number.isFinite(clientId) && clientId > 0) {
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

  // If no client after loading, show error or return early
  if (!client) {
    return (
      <AdminDashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="mt-4 text-gray-600 dark:text-gray-400">Client not found</p>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* <ClientHeader name={client.Name} /> */}

        <ClientInfoCard client={client} />

        {/* Tabs */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <TabsNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            ordersCount={Orders.length}
            productsCount={products.length}
            projectsCount={projectsCount}
            actionButton={getActionButton()}
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
              <ProjectsTab 
                clientId={clientId} 
                projects={projects}
                onActionButtonReady={setProjectsActionButton}
              />
            )}
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default ClientProfilePage;

