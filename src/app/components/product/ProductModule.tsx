"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ViewToggle } from "../admin/common/ViewToggle";
import { Plus } from "lucide-react";
import { ViewMode } from "@/src/types/admin";
import { useRouter } from "next/navigation";
import ProductStats from "./ProductStats";
import useProductStore, { Product } from "@/store/useProductStore";
import { ProductStatus } from "@/src/types/product";
import ProductSearchAndFilters from "./ProductSearchAndFilters";
import ProductTable from "./ProductTable";
import ProductGrid from "./ProductGrid";
import Pagination from "../shipment/Pagination";
import DeleteProduct from "../../products/DeleteProduct";
import ChangeProductStatus from "../../product/component/ChangeProductStatus";
import { Tooltip } from "@heroui/react";
import Link from "next/link";
import { FiSettings } from "react-icons/fi";

const ProductModule = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [statusModalTitle, setStatusModalTitle] = useState<string>("");
  const [currentStatus, setCurrentStatus] = useState<boolean>(false);

  // filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "all">(
    "all"
  );
  const [categoryFilter, setCategoryFilter] = useState<number | "all">("all");
  const [clientFilter, setClientFilter] = useState<number | "all">("all");
  const [fabricFilter, setFabricFilter] = useState<number | "all">("all");
  const [archivedFilter, setArchivedFilter] = useState<
    "all" | "active" | "archived"
  >("all");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });

  // selection & overlays
  const [selectedProductId, setSelectedProductId] = useState<number>(0);
  const [isStatusChangeOpen, setIsStatusChangeOpen] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  // paging
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const router = useRouter();

  const { fetchProducts, products } = useProductStore();

  const handleAddShipment = () => {
    router.push("/product/productform");
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return (products || []).filter((p: Product) => {
      const matchesSearch =
        term === "" ||
        p.Name.toLowerCase().includes(term) ||
        p.ProductCategoryName.toLowerCase().includes(term) ||
        p.FabricType.toLowerCase().includes(term) ||
        p.FabricName.toLowerCase().includes(term) ||
        p.ClientName.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "all" ||
        (p.productStatus || "").toLowerCase() === statusFilter.toLowerCase();

      const matchesCategory =
        categoryFilter === "all" || p.ProductCategoryId === categoryFilter;
      const matchesClient =
        clientFilter === "all" || p.ClientId === clientFilter;
      const matchesFabric =
        fabricFilter === "all" || p.FabricTypeId === fabricFilter;

      const matchesArchived =
        archivedFilter === "all" ||
        (archivedFilter === "active" && !p.isArchived) ||
        (archivedFilter === "archived" && p.isArchived);

      let matchesDate = true;
      if (dateRange.start && dateRange.end) {
        const created = new Date(p.CreatedOn);
        const start = new Date(dateRange.start);
        const end = new Date(dateRange.end);
        matchesDate = created >= start && created <= end;
      }

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory &&
        matchesClient &&
        matchesFabric &&
        matchesArchived &&
        matchesDate
      );
    });
  }, [
    products,
    searchTerm,
    statusFilter,
    categoryFilter,
    clientFilter,
    fabricFilter,
    archivedFilter,
    dateRange,
  ]);

  // pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // reset page on filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    statusFilter,
    categoryFilter,
    clientFilter,
    fabricFilter,
    archivedFilter,
    dateRange,
  ]);

  // delete
  const openDeleteModal = (id: number) => {
    setSelectedProductId(id);
    setIsOpenDeleteModal(true);
  };
  const closeDeleteModal = () => setIsOpenDeleteModal(false);

  // change status
  const handleChangeStatus = (id: number, status: boolean) => {
    setSelectedProductId(id);
    setCurrentStatus(status);
    if (status) {
      setStatusModalTitle("Are you sure you want to Unarchive this product?");
    } else {
      setStatusModalTitle("Are you sure you want to Archive this product?");
    }
    setIsStatusChangeOpen(true);
  };
  const closeChangeStatusModal = () => setIsStatusChangeOpen(false);

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Product</h2>
          <p className="text-gray-600 mt-1">Monitor and manage all products</p>
        </div>
        <div className="flex items-center gap-4">
          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          <Tooltip content="Product Definition">
            <Link
              href={"/product/productdefination"}
              className="dark:bg-slate-500 bg-slate-300 dark:text-white text-gray-800 rounded-lg p-2"
            >
              <FiSettings size={23} />
            </Link>
          </Tooltip>
          <button
            type="button"
            onClick={handleAddShipment}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Stats */}
      <ProductStats products={products || []} />

      {/* Filters */}
      <ProductSearchAndFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        clientFilter={clientFilter}
        onClientChange={setClientFilter}
        fabricFilter={fabricFilter}
        onFabricChange={setFabricFilter}
        archivedFilter={archivedFilter}
        onArchivedChange={setArchivedFilter}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        products={products || []}
      />

      {/* Content */}
      {viewMode === "table" ? (
        <div className="rounded-lg border border-gray-200 overflow-hidden mt-4">
          <ProductTable
            products={paginatedProducts}
            onChangeStatus={handleChangeStatus}
            onDelete={openDeleteModal}
          />
        </div>
      ) : (
        <ProductGrid
          products={paginatedProducts}
          onChangeStatus={handleChangeStatus}
          onDelete={openDeleteModal}
        />
      )}

      {/* Pagination */}
      <div className="p-6 bg-white dark:bg-slate-700 border-t border-slate-200 mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredProducts.length}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>

      {/* Delete Product */}
      <DeleteProduct
        isOpen={isOpenDeleteModal}
        onClose={closeDeleteModal}
        productId={selectedProductId}
      />

      <ChangeProductStatus
        isOpen={isStatusChangeOpen}
        onClose={closeChangeStatusModal}
        productId={selectedProductId}
        title={statusModalTitle}
        currentStatus={currentStatus}
      />
    </div>
  );
};

export default ProductModule;
