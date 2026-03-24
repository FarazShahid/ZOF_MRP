"use client";

import React, { useEffect, useMemo, useState } from "react";
import useEventsStore from "@/store/useEventsStore";
import useOrderStore from "@/store/useOrderStore";
import useProductStore from "@/store/useProductStore";
import EventDetailBreadcrumb from "./detail/EventDetailBreadcrumb";
import EventDetailHeader from "./detail/EventDetailHeader";
import EventDetailTabs, {
  EventDetailTabType,
} from "./detail/EventDetailTabs";
import EventDetailOrdersTab from "./detail/EventDetailOrdersTab";
import EventDetailProductsTab from "./detail/EventDetailProductsTab";
import EventDetailFilesTab from "./detail/EventDetailFilesTab";
import EventDetailActivityTab from "./detail/EventDetailActivityTab";

interface EventDetailProps {
  eventId: number;
}

export default function EventDetail({ eventId }: EventDetailProps) {
  const [activeTab, setActiveTab] = useState<EventDetailTabType>("orders");

  const {
    eventById: event,
    getEventsById,
    loading: eventLoading,
  } = useEventsStore();

  const {
    Orders: allOrders = [],
    fetchOrders,
    loading: ordersLoading,
  } = useOrderStore();

  const { products, getProductByClientId } = useProductStore();

  const orders = useMemo(
    () => allOrders.filter((o) => o.OrderEventId === eventId),
    [allOrders, eventId]
  );

  useEffect(() => {
    if (Number.isFinite(eventId) && eventId > 0) {
      getEventsById(eventId);
    }
  }, [eventId, getEventsById]);

  useEffect(() => {
    if (event?.ClientId) {
      getProductByClientId(event.ClientId);
      fetchOrders(event.ClientId, eventId);
    }
  }, [event?.ClientId, eventId, getProductByClientId, fetchOrders]);

  if (!event && eventLoading && Number.isFinite(eventId) && eventId > 0) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center text-white">Event not found</div>
      </div>
    );
  }

  const tabCounts = {
    orders: orders.length,
    products: products.length,
    files: 0,
    activity: 0,
  };

  return (
    <div className="p-8">
      <EventDetailBreadcrumb event={event} />
      <EventDetailHeader
        event={event}
        ordersCount={orders.length}
        productsCount={products.length}
      />
      <EventDetailTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={tabCounts}
      />

      {activeTab === "orders" && (
        <EventDetailOrdersTab orders={orders} loading={ordersLoading} />
      )}
      {activeTab === "products" && (
        <EventDetailProductsTab products={products} />
      )}
      {activeTab === "files" && <EventDetailFilesTab />}
      {activeTab === "activity" && <EventDetailActivityTab />}
    </div>
  );
}
