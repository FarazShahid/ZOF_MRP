"use client";

import React, { useEffect, useMemo, useState } from "react";
import useClientStore from "@/store/useClientStore";
import useOrderStore from "@/store/useOrderStore";
import useProductStore from "@/store/useProductStore";
import useShipmentStore from "@/store/useShipmentStore";
import { OrderStatusEnum } from "@/src/types/admin";
import ClientProfileBreadcrumb from "./profile/ClientProfileBreadcrumb";
import ClientProfileHeader from "./profile/ClientProfileHeader";
import ClientProfileTabs, {
  ClientProfileTabType,
} from "./profile/ClientProfileTabs";
import ClientProfileOverview from "./profile/ClientProfileOverview";
import ClientProfileContacts from "./profile/ClientProfileContacts";
import ClientProfilePrograms from "./profile/ClientProfilePrograms";
import ClientProfileProducts from "./profile/ClientProfileProducts";
import ClientProfileOrders from "./profile/ClientProfileOrders";
import ClientProfileShipments from "./profile/ClientProfileShipments";
import ClientProfileFiles from "./profile/ClientProfileFiles";

interface ClientProfileProps {
  clientId: number;
}

export default function ClientProfile({ clientId }: ClientProfileProps) {
  const [activeTab, setActiveTab] = useState<ClientProfileTabType>("overview");

  const {
    clientById: client,
    getClientById,
    loading: clientLoading,
    projects,
    fetchProjects,
  } = useClientStore();

  const { Orders: allOrders = [], fetchOrders, loading: ordersLoading } =
    useOrderStore();
  const { products, getProductByClientId } = useProductStore();
  const { Shipments: allShipments = [], fetchShipments } = useShipmentStore();

  const orders = useMemo(
    () => allOrders.filter((o) => o.ClientId === clientId),
    [allOrders, clientId]
  );

  const clientOrderIds = useMemo(
    () => orders.map((o) => o.Id),
    [orders]
  );

  const shipments = useMemo(() => {
    return allShipments.filter((s) =>
      s.Orders?.some((o: { Id: number }) => clientOrderIds.includes(o.Id))
    );
  }, [allShipments, clientOrderIds]);

  const projectsForClient = useMemo(
    () => projects.filter((p) => p.ClientId === clientId),
    [projects, clientId]
  );

  const completedOrdersCount = useMemo(
    () =>
      orders.filter((o) =>
        o.StatusName?.toLowerCase().includes(
          OrderStatusEnum.Shipped?.toLowerCase() || "shipped"
        )
      ).length,
    [orders]
  );

  useEffect(() => {
    if (Number.isFinite(clientId) && clientId > 0) {
      getClientById(clientId);
      getProductByClientId(clientId);
      fetchOrders(clientId);
      fetchProjects(clientId);
      fetchShipments();
    }
  }, [clientId, getClientById, getProductByClientId, fetchOrders, fetchProjects, fetchShipments]);

  if (!client && clientLoading && Number.isFinite(clientId) && clientId > 0) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading client profile...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center text-white">Client not found</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <ClientProfileBreadcrumb client={client} />
      <ClientProfileHeader client={client} clientId={clientId} />
      <ClientProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "overview" && (
        <ClientProfileOverview
          client={client}
          ordersCount={orders.length}
          productsCount={products.length}
          completedOrdersCount={completedOrdersCount}
          projectsCount={projectsForClient.length}
          onTabChange={(tab) =>
            setActiveTab(
              tab === "orders"
                ? "orders"
                : tab === "products"
                ? "products"
                : "programs"
            )
          }
        />
      )}

      {activeTab === "contacts" && <ClientProfileContacts client={client} />}

      {activeTab === "programs" && (
        <ClientProfilePrograms
          projects={projectsForClient}
          clientId={clientId}
        />
      )}

      {activeTab === "products" && (
        <ClientProfileProducts products={products} />
      )}

      {activeTab === "orders" && (
        <ClientProfileOrders orders={orders} loading={ordersLoading} />
      )}

      {activeTab === "shipments" && (
        <ClientProfileShipments shipments={shipments} />
      )}

      {activeTab === "files" && <ClientProfileFiles />}
    </div>
  );
}
