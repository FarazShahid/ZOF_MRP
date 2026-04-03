"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ViewToggle } from "../admin/common/ViewToggle";
import { ShipmentStatus, ViewMode } from "@/src/types/admin";
import { Plus } from "lucide-react";
import ShipmentStats from "./ShipmentStats";
import useShipmentStore from "@/store/useShipmentStore";
import ShipmentTable from "./ShipmentTable";
import Pagination from "../common/Pagination";
import NoData from "../common/NoData";
import SearchAndFilters from "./SearchAndFilters";
import ShipmentGrid from "./ShipmentGrid";
import ShipmentDetail from "./ShipmentDetail";
import DeleteShipment from "../../shipments/components/DeleteShipment";
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
  const totalPages = Math.max(
    1,
    Math.ceil((filteredShipments?.length || 0) / Math.max(1, itemsPerPage))
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedShipments = filteredShipments?.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset current page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, carrierFilter, dateRange]);

  // Clamp current page when page size or filtered length changes
  useEffect(() => {
    const newTotalPages = Math.max(
      1,
      Math.ceil((filteredShipments?.length || 0) / Math.max(1, itemsPerPage))
    );
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }
  }, [itemsPerPage, filteredShipments?.length]);

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
    router.push("/shipments/addshipment");
  };
  useEffect(() => {
    fetchShipments();
  }, []);

  return (
    <div className="p-6 rounded">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Shipments</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Monitor and manage all shipments</p>
        </div>
        <div className="flex items-center gap-4">
          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />

          <PermissionGuard required={PERMISSIONS_ENUM.SHIPMENT.ADD}>
            <button
              type="button"
              onClick={handleAddShipment}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Shipment
            </button>
          </PermissionGuard>
        </div>
      </div>

      {/* Stats */}
      <ShipmentStats
        shipments={Shipments}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />
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
      {(filteredShipments?.length || 0) === 0 ? (
        <div className="rounded-lg border border-gray-200 overflow-hidden mt-6 p-10 bg-white dark:bg-slate-800">
          <NoData title="No shipments found" message="Try adjusting filters or create a new shipment." />
        </div>
      ) : (
        <>
          {viewMode === "table" ? (
            <div className="rounded-lg border border-gray-200 overflow-hidden mt-4 mb-4">
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

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            pageSize={itemsPerPage}
            onPageSizeChange={(size) => {
              setItemsPerPage(size);
              setCurrentPage(1);
            }}
            pageSizeOptions={[5, 10, 20, 50, 100]}
            totalItems={filteredShipments?.length || 0}
            startIndex={startIndex}
            itemLabel="records"
          />
        </>
      )}
  

      {/* Overlay Drawer */}
      {selectedShipment > 0 && (
        <ShipmentDetail
          shipmentId={selectedShipment}
          isOpen={isDetailOpen}
          onClose={handleCloseDetail}
        />
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
