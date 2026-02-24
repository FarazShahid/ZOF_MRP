"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import useClientStore, { GetClientsType } from "@/store/useClientStore";
import ClientKPITiles from "./ClientKPITiles";
import ClientFilters from "./ClientFilters";
import AddClientModal from "./AddClientModal";
import DeleteConfirmationModal from "@/src/components/common/DeleteConfirmationModal";

const ITEMS_PER_PAGE = 10;

export default function Clients() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClientId, setEditingClientId] = useState<number | null>(null);

  const { fetchClients, clients, loading, deleteclient } = useClientStore();

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
      totalRevenue: 0,
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

  const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedClients = filteredClients.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    if (filteredClients.length > 0 && currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [filteredClients.length, currentPage, totalPages]);

  const handleDeleteClick = (clientId: number) => {
    setClientToDelete(clientId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (clientToDelete) {
      await deleteclient(clientToDelete, () => {
        setShowDeleteModal(false);
        setClientToDelete(null);
      });
    }
  };

  const handleEditClick = (clientId: number) => {
    setEditingClientId(clientId);
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setEditingClientId(null);
  };

  const getStatusLabel = (client: GetClientsType) =>
    client.ClientStatusId === "1" ? "Active" : "Inactive";

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Clients</h1>
          <p className="text-slate-400 text-sm">
            Manage client relationships and accounts
          </p>
        </div>

        <button
          onClick={() => {
            setEditingClientId(null);
            setShowAddModal(true);
          }}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>
          Add Client
        </button>
      </div>

      <ClientKPITiles clientKpiData={clientKpiData} />

      <ClientFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Business Name
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  POC Name
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  POC Email
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Phone
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    Loading...
                  </td>
                </tr>
              ) : paginatedClients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No clients found
                  </td>
                </tr>
              ) : (
                paginatedClients.map((client) => (
                  <tr
                    key={client.Id}
                    className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-white">
                          {client.Name}
                        </div>
                        <div className="text-xs text-slate-500">{client.Id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {client.POCName || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {client.POCEmail || client.Email || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {client.Phone || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${
                          client.ClientStatusId === "1"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                        }`}
                      >
                        {getStatusLabel(client)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/client/${client.Id}`}
                          className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                          title="View Profile"
                        >
                          <i className="ri-eye-line w-4 h-4 flex items-center justify-center"></i>
                        </Link>
                        <button
                          onClick={() => handleEditClick(client.Id)}
                          className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(client.Id)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredClients.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800">
            <div className="text-sm text-slate-400">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + ITEMS_PER_PAGE, filteredClients.length)} of{" "}
              {filteredClients.length} clients
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setClientToDelete(null);
        }}
        onConfirm={confirmDelete}
        entityTitle="Client"
        isLoading={loading}
      />

      <AddClientModal
        isOpen={showAddModal}
        onClose={closeAddModal}
        onSuccess={fetchClients}
        isEdit={!!editingClientId}
        clientId={editingClientId ?? 0}
      />
    </div>
  );
}
