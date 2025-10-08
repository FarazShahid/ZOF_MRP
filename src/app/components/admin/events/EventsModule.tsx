import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import EventTable from "./EventTable";
import useEventsStore from "@/store/useEventsStore";
import DeleteEvent from "@/src/app/events/DeleteEvent";
import EventsForm from "@/src/app/events/EventsForm";
import PermissionGuard from "../../auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";

const EventsModule: React.FC = () => {
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [selectedEventId, setSelectedEventId] = useState<number>(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const { fetchEvents, Events, loading } = useEventsStore();

  const openAddModal = () => setIsAddModalOpen(true);

  const handleOpenDeleteModal = (productCatagoryId: number) => {
    setSelectedEventId(productCatagoryId);
    setIsOpenDeleteModal(true);
  };
  const closeDeleteModal = () => setIsOpenDeleteModal(false);
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setIsEdit(false);
  };
  const openEditModal = (clientId: number) => {
    setSelectedEventId(clientId);
    setIsAddModalOpen(true);
    setIsEdit(true);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Events</h2>
          <p className="text-gray-600 mt-1">Manage client events</p>
        </div>

        <PermissionGuard required={PERMISSIONS_ENUM.EVENTS.ADD}>
          <button
            type="button"
            onClick={openAddModal}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </button>
        </PermissionGuard>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <EventTable
          Events={Events}
          loading={loading}
          onDelete={handleOpenDeleteModal}
          onEdit={openEditModal}
        />
      </div>

      {/* Add / Edit Modal */}
      {isAddModalOpen && (
        <EventsForm
          isOpen={isAddModalOpen}
          closeAddModal={closeAddModal}
          isEdit={isEdit}
          eventId={selectedEventId}
        />
      )}

      {/* Delete Modal */}
      <DeleteEvent
        isOpen={isOpenDeletModal}
        onClose={closeDeleteModal}
        eventId={selectedEventId}
      />
    </div>
  );
};

export default EventsModule;
