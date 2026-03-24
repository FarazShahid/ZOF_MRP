"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { ViewToggle } from "../common/ViewToggle";
import { ViewMode } from "@/src/types/admin";
import useClientStore, { GetClientsType } from "@/store/useClientStore";
import CustomerCard from "./CustomerCard";
import AddClients from "../../AddClients";
import DeleteClient from "../../DeleteClient";
import CustomerTable from "./CustomerTable";
import PermissionGuard from "../../auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import ClientKPITiles from "@/src/components/clients/ClientKPITiles";
import AddClientModal from "@/src/components/clients/AddClientModal";
import ClientFilters from "@/src/components/clients/ClientFilters";

const CustomersModule: React.FC = () => {
  // Default to card (grid) view for a more visual client overview
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] =
    useState<GetClientsType | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<number>(0);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleCustomerClick = (customer: GetClientsType) => {
    setSelectedCustomer(customer);
    setSidebarOpen(true);
  };

  const { fetchClients, clients, loading } = useClientStore();

  const clientKpiData = useMemo(() => {
    if (!clients) {
      return {
        totalClients: 0,
        activeClients: 0,
        inactiveClients: 0,
        newThisMonth: 0,
        totalRevenue: 0,
      };
    }
    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const activeClients = clients.filter((c) => c.ClientStatusId === "1").length;
    return {
      totalClients: clients.length,
      activeClients,
      inactiveClients: clients.length - activeClients,
      newThisMonth: clients.filter(
        (c) => new Date(c.CreatedOn) >= firstOfMonth
      ).length,
      totalRevenue: 0, // TODO: aggregate from orders if available
    };
  }, [clients]);

  const filteredClients = useMemo(() => {
    if (!clients) return [];
    let result = clients;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.Name?.toLowerCase().includes(q) ||
          c.POCName?.toLowerCase().includes(q) ||
          c.Email?.toLowerCase().includes(q) ||
          c.POCEmail?.toLowerCase().includes(q) ||
          c.Phone?.includes(q)
      );
    }
    if (statusFilter === "active") {
      result = result.filter((c) => c.ClientStatusId === "1");
    } else if (statusFilter === "inactive") {
      result = result.filter((c) => c.ClientStatusId !== "1");
    }
    return result;
  }, [clients, searchQuery, statusFilter]);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setIsEdit(false);
  };
  const handleOpenDeleteModal = (clientId: number) => {
    setSelectedClientId(clientId);
    setIsOpenDeleteModal(true);
  };
  const closeDeleteModal = () => setIsOpenDeleteModal(false);
  const handleOpenEditModal = (clientId: number) => {
    setSelectedClientId(clientId);
    setIsEdit(true);
    setIsAddModalOpen(true);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Clients</h2>
          <p className="text-gray-600 mt-1">
            Manage client accounts and order history
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          
          <PermissionGuard required={PERMISSIONS_ENUM.CLIENTS.ADD}>
            <button
              type="button"
              onClick={openAddModal}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Client
            </button>
          </PermissionGuard>
        </div>
      </div>

      <ClientKPITiles clientKpiData={clientKpiData} />

      <ClientFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Content */}
      {viewMode === "table" ? (
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <CustomerTable
            clients={filteredClients}
            loading={loading}
            onEdit={(id) => handleOpenEditModal(id)}
            onDelete={(id) => handleOpenDeleteModal(id)}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients?.map((customer) => (
            <CustomerCard
              key={customer?.Id}
              customer={customer}
              onCustomerClick={(customer) => handleCustomerClick(customer)}
              onEdit={(id) => handleOpenEditModal(id)}
              onDelete={(id) => handleOpenDeleteModal(id)}
            />
          ))}
        </div>
      )}

      {isAddModalOpen && !isEdit && (
        <AddClientModal
          isOpen={isAddModalOpen}
          onClose={closeAddModal}
          onSuccess={fetchClients}
        />
      )}
      {isAddModalOpen && isEdit && (
        <AddClients
          isOpen={isAddModalOpen}
          closeAddModal={closeAddModal}
          isEdit={isEdit}
          clientId={selectedClientId}
        />
      )}

      <DeleteClient
        isOpen={isOpenDeletModal}
        onClose={closeDeleteModal}
        clientId={selectedClientId}
      />
    </div>
  );
};

export default CustomersModule;
