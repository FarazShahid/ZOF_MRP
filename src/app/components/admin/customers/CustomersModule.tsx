import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { ViewToggle } from "../common/ViewToggle";
import { ViewMode } from "@/src/types/admin";
import { CustomerDetailSidebar } from "./CustomerDetailSidebar";
import useClientStore, { GetClientsType } from "@/store/useClientStore";
import CustomerStats from "./CustomerStats";
import CustomerCard from "./CustomerCard";
import AddClients from "../../AddClients";
import DeleteClient from "../../DeleteClient";
import CustomerTable from "./CustomerTable";

export const CustomersModule: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] =
    useState<GetClientsType | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<number>(0);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState<boolean>(false);

  const handleCustomerClick = (customer: GetClientsType) => {
    setSelectedCustomer(customer);
    setSidebarOpen(true);
  };

  const { fetchClients, clients, loading } = useClientStore();

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
          <button
            type="button"
            onClick={openAddModal}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Client
          </button>
        </div>
      </div>

      {/* Stats */}

      <CustomerStats customers={clients} />

      {/* Content */}
      {viewMode === "table" ? (
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <CustomerTable
            clients={clients}
            loading={loading}
            onEdit={(id) => handleOpenEditModal(id)}
            onDelete={(id) => handleOpenDeleteModal(id)}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((customer) => (
            <CustomerCard
              customer={customer}
              onCustomerClick={(customer) => handleCustomerClick(customer)}
              onEdit={(id) => handleOpenEditModal(id)}
              onDelete={(id) => handleOpenDeleteModal(id)}
            />
          ))}
        </div>
      )}

      <AddClients
        isOpen={isAddModalOpen}
        closeAddModal={closeAddModal}
        isEdit={isEdit}
        clientId={selectedClientId}
      />

      <DeleteClient
        isOpen={isOpenDeletModal}
        onClose={closeDeleteModal}
        clientId={selectedClientId}
      />

      {/* Customer Detail Sidebar */}
      <CustomerDetailSidebar
        customer={selectedCustomer}
        isOpen={sidebarOpen}
        onClose={() => {
          setSidebarOpen(false);
          setSelectedCustomer(null);
        }}
      />
    </div>
  );
};
