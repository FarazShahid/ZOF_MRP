"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Sidebar } from "./Sidebar";
import { ActiveModule } from "@/src/types/admin";
import { TableSkel } from "../ui/Skeleton/TableSkel";

// lazy load
const UsersModule = dynamic(() => import("./users/UsersModule"), {
  loading: () => <TableSkel />,
});
const CustomersModule = dynamic(() => import("./customers/CustomersModule"), {
  ssr: false,
  loading: () => <TableSkel />,
});
const EventsModule = dynamic(() => import("./events/EventsModule"), {
  ssr: false,
  loading: () => <TableSkel />,
});
const CarriorTable = dynamic(
  () => import("../../shipment/carrior/components/CarriorTable"),
  {
    ssr: false,
    loading: () => <TableSkel />,
  }
);

export const AdminSettings: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ActiveModule>("users");

  const renderActiveModule = () => {
    switch (activeModule) {
      case "users":
        return <UsersModule />;
      case "customers":
        return <CustomersModule />;
      case "events":
        return <EventsModule />;
      case "carriers":
        return <CarriorTable />;
      default:
        return <UsersModule />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />
      <div className="flex-1 overflow-auto">{renderActiveModule()}</div>
    </div>
  );
};
