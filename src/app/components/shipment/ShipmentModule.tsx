"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ViewToggle } from "../admin/common/ViewToggle";
import { ShipmentStatus, ViewMode } from "@/src/types/admin";
import { Plus } from "lucide-react";
import ShipmentStats from "./ShipmentStats";
import useShipmentStore from "@/store/useShipmentStore";
import ShipmentTable from "./ShipmentTable";
import Pagination from "./Pagination";
import SearchAndFilters from "./SearchAndFilters";
import ShipmentGrid from "./ShipmentGrid";
import ShipmentDetail from "./ShipmentDetail";
import DeleteShipment from "../../shipment/components/DeleteShipment";
import { useRouter } from "next/navigation";
import PermissionGuard from "../auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";

const ShipmentModule = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus | "all">(
    "all"
  );
  const [selectedShipment, setSelectedShipment] = useState(0);
  const [carrierFilter, setCarrierFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState<boolean>(false);

  const router = useRouter();

  const { fetchShipments, Shipments } = useShipmentStore();

  // Filter shipments based on search and filters
  const filteredShipments = useMemo(() => {
    return Shipments?.filter((shipment) => {
      const matchesSearch =
        searchTerm === "" ||
        shipment?.ShipmentCode?.toLowerCase().includes(
          searchTerm.toLowerCase()
        ) ||
        shipment?.ShipmentCarrierName.toLowerCase().includes(
          searchTerm.toLowerCase()
        ) ||
        shipment?.Orders.some((order) =>
          order?.OrderNumber.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesStatus =
        statusFilter === "all" || shipment.Status === statusFilter;
      const matchesCarrier =
        carrierFilter === "all" ||
        shipment.ShipmentCarrierName === carrierFilter;

      let matchesDateRange = true;
      if (dateRange.start && dateRange.end) {
        const shipmentDate = new Date(shipment?.ShipmentDate);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        matchesDateRange = shipmentDate >= startDate && shipmentDate <= endDate;
      }

      return (
        matchesSearch && matchesStatus && matchesCarrier && matchesDateRange
      );
    });
  }, [Shipments, searchTerm, statusFilter, carrierFilter, dateRange]);

  // Pagination
  const totalPages = Math.ceil(filteredShipments?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedShipments = filteredShipments?.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset current page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, carrierFilter, dateRange]);

  // handel view detail
  const handleonViewDetails = (shipmentId: number) => {
    setSelectedShipment(shipmentId);
    setIsDetailOpen(true);
  };
  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedShipment(0);
  };

  // delete modal
  const handleOpenDeleteModal = (id: number) => {
    setSelectedShipment(id);
    setIsOpenDeleteModal(true);
  };
  const closeDeleteModal = () => setIsOpenDeleteModal(false);

  const handleAddShipment = () => {
    router.push("/shipment/addshipment");
  };
  useEffect(() => {
    fetchShipments();
  }, []);

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Shipment</h2>
          <p className="text-gray-600 mt-1">Monitor and manage all shipments</p>
        </div>
        <div className="flex items-center gap-4">
          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />

          <PermissionGuard required={PERMISSIONS_ENUM.SHIPMENT.ADD}>
            <button
              type="button"
              onClick={handleAddShipment}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Shipment
            </button>
          </PermissionGuard>
        </div>
      </div>

      {/* Stats */}
      <ShipmentStats shipments={Shipments} />
      <SearchAndFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        carrierFilter={carrierFilter}
        onCarrierChange={setCarrierFilter}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        shipments={Shipments}
      />
      {/* Content */}
      {viewMode === "table" ? (
        <div className="rounded-lg border border-gray-200 overflow-hidden mt-4">
          <ShipmentTable
            onViewDetails={(id) => handleonViewDetails(id)}
            onDelete={(id) => handleOpenDeleteModal(id)}
            shipments={paginatedShipments}
          />
        </div>
      ) : (
        <ShipmentGrid
          onViewDetails={(id) => handleonViewDetails(id)}
          onDelete={(id) => handleOpenDeleteModal(id)}
          shipments={paginatedShipments}
        />
      )}

      <div className="p-6 bg-white dark:bg-slate-700 border-t border-slate-200 mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredShipments?.length}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>

      {/* Overlay Drawer */}
      {isDetailOpen && selectedShipment && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={handleCloseDetail}
          />
          <ShipmentDetail
            shipmentId={selectedShipment}
            onClose={handleCloseDetail}
          />
        </>
      )}

      {/* Delete Shipment */}
      <DeleteShipment
        Id={selectedShipment}
        isOpen={isOpenDeletModal}
        onClose={closeDeleteModal}
      />
    </div>
  );
};

export default ShipmentModule;
