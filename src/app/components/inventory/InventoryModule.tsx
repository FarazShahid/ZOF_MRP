"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ViewToggle } from "../admin/common/ViewToggle";
import { Plus } from "lucide-react";
import { ViewMode } from "@/src/types/admin";
import InventoryStats from "./InventoryStats";
import InventorySeachAndFilter from "./InventorySeachAndFilter";
import InventoryItemTable from "./InventoryItemTable";
import InventoryItemGrid from "./InventoryItemGrid";
import Pagination from "../common/Pagination";
import PermissionGuard from "../auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import useInventoryItemsStore, { InventoryItemResponse } from "@/store/useInventoryItemsStore";
import DeleteInventoryItem from "../../inventoryItems/DeleteInventoryItem";
import AddItems from "../../inventoryItems/AddItems";
import ViewItem from "../../inventoryItems/ViewItem";
import { Tooltip } from "@heroui/react";
import Link from "next/link";
import { FiSettings } from "react-icons/fi";

const InventoryModule = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  // filters
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<number | "all">("all");
  const [subCategoryFilter, setSubCategoryFilter] = useState<string | "all">("all");
  const [supplierFilter, setSupplierFilter] = useState<string | "all">("all");
  const [uomFilter, setUomFilter] = useState<string | "all">("all");
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "normal" | "high">("all");

  // selection & overlays
  const [selectedItemId, setSelectedItemId] = useState<number>(0);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isOpenViewModal, setIsOpenViewModal] = useState(false);

  // paging
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { fetchInventoryItems, inventoryItems, loading } = useInventoryItemsStore();

  useEffect(() => {
    fetchInventoryItems();
  }, [fetchInventoryItems]);

  const computeStockLevel = (it: InventoryItemResponse): "low" | "normal" | "high" => {
    const stock = Number(it.Stock ?? 0);
    const reorder = Number(it.ReorderLevel ?? 0);
    if (Number.isFinite(stock) && Number.isFinite(reorder)) {
      if (stock <= reorder) return "low";
      if (stock >= reorder * 2) return "high";
    }
    return "normal";
  };

  const filteredItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return (inventoryItems || []).filter((it: InventoryItemResponse) => {
      const matchesSearch =
        term === "" ||
        it.Name.toLowerCase().includes(term) ||
        (it.ItemCode || "").toLowerCase().includes(term) ||
        (it.SubCategoryName || "").toLowerCase().includes(term) ||
        (it.SupplierName || "").toLowerCase().includes(term) ||
        (it.UnitOfMeasureName || "").toLowerCase().includes(term);

      const matchesCategory = categoryFilter === "all" || it.CategoryId === categoryFilter;
      const matchesSubCategory = subCategoryFilter === "all" || (it.SubCategoryName || "") === subCategoryFilter;
      const matchesSupplier = supplierFilter === "all" || (it.SupplierName || "") === supplierFilter;
      const matchesUom = uomFilter === "all" || (it.UnitOfMeasureShortForm || it.UnitOfMeasureName || "") === uomFilter;

      const level = computeStockLevel(it);
      const matchesStock = stockFilter === "all" || level === stockFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSubCategory &&
        matchesSupplier &&
        matchesUom &&
        matchesStock
      );
    });
  }, [inventoryItems, searchTerm, categoryFilter, subCategoryFilter, supplierFilter, uomFilter, stockFilter]);

  // pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  // clamp page when page size or filtered length changes
  useEffect(() => {
    const newTotalPages = Math.max(
      1,
      Math.ceil(filteredItems.length / Math.max(1, itemsPerPage))
    );
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }
  }, [itemsPerPage, filteredItems.length]);

  // reset page on filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, subCategoryFilter, supplierFilter, uomFilter, stockFilter]);

  // actions
  const openDeleteModal = (id: number) => {
    setSelectedItemId(id);
    setIsOpenDeleteModal(true);
  };
  const closeDeleteModal = () => setIsOpenDeleteModal(false);

  const openAddModal = () => {
    setIsEdit(false);
    setIsOpenAddModal(true);
  };
  const openEditModal = (id: number) => {
    setSelectedItemId(id);
    setIsEdit(true);
    setIsOpenAddModal(true);
  };
  const closeAddModal = () => {
    setIsEdit(false);
    setIsOpenAddModal(false);
  };

  const openViewModal = (id: number) => {
    setSelectedItemId(id);
    setIsOpenViewModal(true);
  };
  const closeViewModal = () => setIsOpenViewModal(false);

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inventory</h2>
          <p className="text-gray-600 mt-1">Monitor and manage all inventory items</p>
        </div>
        <div className="flex items-center gap-4">
          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          <Tooltip content="Inventory Setup">
            <Link
              href={"/inventoryItems/Inventorysetup"}
              className="dark:bg-slate-500 bg-slate-300 dark:text-white text-gray-800 rounded-lg p-2"
            >
              <FiSettings size={23} />
            </Link>
          </Tooltip>
          <PermissionGuard required={PERMISSIONS_ENUM.INVENTORY_ITEMS.ADD}>
            <button
              type="button"
              onClick={openAddModal}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </PermissionGuard>
        </div>
      </div>

      {/* Stats */}
      <InventoryStats items={inventoryItems || []} />

      {/* Filters */}
      <InventorySeachAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        subCategoryFilter={subCategoryFilter}
        onSubCategoryChange={setSubCategoryFilter}
        supplierFilter={supplierFilter}
        onSupplierChange={setSupplierFilter}
        uomFilter={uomFilter}
        onUomChange={setUomFilter}
        stockFilter={stockFilter}
        onStockChange={setStockFilter}
        items={inventoryItems || []}
      />

      {/* Content */}
      {viewMode === "table" ? (
        <div className="rounded-lg border border-gray-200 overflow-hidden mt-4">
          <InventoryItemTable
            items={paginatedItems}
            onView={openViewModal}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
          />
        </div>
      ) : (
        <InventoryItemGrid
          items={paginatedItems}
          onView={openViewModal}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
        />
      )}

      {/* Pagination */}
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
      />

      {/* Modals */}
      <DeleteInventoryItem
        isOpen={isOpenDeleteModal}
        onClose={closeDeleteModal}
        Id={selectedItemId}
      />

      {isOpenAddModal && (
        <AddItems
          isOpen={isOpenAddModal}
          closeAddModal={closeAddModal}
          isEdit={isEdit}
          Id={selectedItemId}
        />
      )}

      {isOpenViewModal && (
        <ViewItem
          Id={selectedItemId}
          isOpen={isOpenViewModal}
          closeAddModal={closeViewModal}
        />
      )}
    </div>
  );
};

export default InventoryModule;


