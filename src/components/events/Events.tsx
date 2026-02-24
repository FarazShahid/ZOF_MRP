"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import useEventsStore, { Events } from "@/store/useEventsStore";
import useClientStore from "@/store/useClientStore";
import useOrderStore from "@/store/useOrderStore";
import EventKPITiles from "./EventKPITiles";
import EventFilters from "./EventFilters";
import AddEventModal from "./AddEventModal";
import DeleteConfirmationModal from "@/src/components/common/DeleteConfirmationModal";

const ITEMS_PER_PAGE = 10;

export default function Events() {
  const [searchQuery, setSearchQuery] = useState("");
  const [clientFilter, setClientFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);

  const { Events: events, fetchEvents, loading, deleteEvent } = useEventsStore();
  const { clients, fetchClients } = useClientStore();
  const { Orders: orders = [], fetchOrders } = useOrderStore();

  const eventKpiData = useMemo(() => {
    const list = events || [];
    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const eventIdsWithOrders = new Set(
      orders.filter((o) => o.OrderEventId > 0).map((o) => o.OrderEventId)
    );
    const uniqueClients = new Set(list.map((e) => e.ClientId)).size;

    return {
      totalEvents: list.length,
      withOrders: list.filter((e) => eventIdsWithOrders.has(e.Id)).length,
      uniqueClients,
      newThisMonth: list.filter(
        (e) => new Date(e.CreatedOn) >= firstOfMonth
      ).length,
    };
  }, [events, orders]);

  const filteredEvents = useMemo(() => {
    const list = events || [];
    let result = list;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (e) =>
          e.EventName?.toLowerCase().includes(q) ||
          e.ClientName?.toLowerCase().includes(q) ||
          e.Description?.toLowerCase().includes(q)
      );
    }

    if (clientFilter !== "all") {
      const clientId = Number(clientFilter);
      result = result.filter((e) => e.ClientId === clientId);
    }

    return result;
  }, [events, searchQuery, clientFilter]);

  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEvents = filteredEvents.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  useEffect(() => {
    fetchEvents();
    fetchClients();
    fetchOrders();
  }, [fetchEvents, fetchClients, fetchOrders]);

  useEffect(() => {
    if (filteredEvents.length > 0 && currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [filteredEvents.length, currentPage, totalPages]);

  const handleDeleteClick = (eventId: number) => {
    setEventToDelete(eventId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (eventToDelete) {
      await deleteEvent(eventToDelete, () => {
        setShowDeleteModal(false);
        setEventToDelete(null);
      });
    }
  };

  const handleEditClick = (eventId: number) => {
    setEditingEventId(eventId);
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setEditingEventId(null);
  };

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Events</h1>
          <p className="text-slate-400 text-sm">
            Manage programs, campaigns, and seasonal events
          </p>
        </div>

        <button
          onClick={() => {
            setEditingEventId(null);
            setShowAddModal(true);
          }}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>
          Add Event
        </button>
      </div>

      <EventKPITiles eventKpiData={eventKpiData} />

      <EventFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        clientFilter={clientFilter}
        onClientFilterChange={setClientFilter}
        clients={clients || []}
      />

      {/* Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Event Name
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Client
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Description
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    Loading...
                  </td>
                </tr>
              ) : paginatedEvents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <i className="ri-calendar-event-line text-4xl mb-2 block w-10 h-10 mx-auto flex items-center justify-center"></i>
                    No events found
                  </td>
                </tr>
              ) : (
                paginatedEvents.map((event: Events) => (
                  <tr
                    key={event.Id}
                    className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-white">
                          {event.EventName}
                        </div>
                        <div className="text-xs text-slate-500">#{event.Id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {event.ClientName || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300 max-w-xs truncate">
                      {event.Description || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {event.CreatedOn
                        ? new Date(event.CreatedOn).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/events/${event.Id}`}
                          className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                          title="View"
                        >
                          <i className="ri-eye-line w-4 h-4 flex items-center justify-center"></i>
                        </Link>
                        <button
                          onClick={() => handleEditClick(event.Id)}
                          className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(event.Id)}
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
        {filteredEvents.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800">
            <div className="text-sm text-slate-400">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + ITEMS_PER_PAGE, filteredEvents.length)} of{" "}
              {filteredEvents.length} events
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
          setEventToDelete(null);
        }}
        onConfirm={confirmDelete}
        entityTitle="Event"
        message="Are you sure you want to delete this event?"
        isLoading={loading}
      />

      <AddEventModal
        isOpen={showAddModal}
        onClose={closeAddModal}
        onSuccess={fetchEvents}
        isEdit={!!editingEventId}
        eventId={editingEventId ?? 0}
      />
    </div>
  );
}
