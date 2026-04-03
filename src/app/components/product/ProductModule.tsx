"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ViewToggle } from "../admin/common/ViewToggle";
import { Plus } from "lucide-react";
import { ViewMode } from "@/src/types/admin";
import { useRouter } from "next/navigation";
import ProductStats from "./ProductStats";
import useProductStore, { Product } from "@/store/useProductStore";
import useClientStore from "@/store/useClientStore";
import { ProductStatus } from "@/src/types/product";
import ProductSearchAndFilters from "./ProductSearchAndFilters";
import ProductTable from "./ProductTable";
import ProductGrid from "./ProductGrid";
import Pagination from "../common/Pagination";
import DeleteProduct from "../../products/DeleteProduct";
import ChangeProductStatus from "../../product/component/ChangeProductStatus";
import NoData from "../common/NoData";
import Link from "next/link";
import { FiSettings } from "react-icons/fi";
import PermissionGuard from "../auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import { Tooltip } from "@heroui/react";

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
  const [projectFilter, setProjectFilter] = useState<number | "all">("all");
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
  const { fetchProjects, projects } = useClientStore();

  const handleAddProduct = () => {
    router.push("/product/productform");
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (projectFilter !== "all" && Number.isFinite(Number(projectFilter))) {
      fetchProducts(Number(projectFilter));
    } else {
      fetchProducts();
    }
  }, [projectFilter, fetchProducts]);

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

  // clamp page when page size or filtered length changes
  useEffect(() => {
    const newTotalPages = Math.max(
      1,
      Math.ceil(filteredProducts.length / Math.max(1, itemsPerPage))
    );
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }
  }, [itemsPerPage, filteredProducts.length]);

  // reset page on filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    statusFilter,
    categoryFilter,
    clientFilter,
    projectFilter,
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
    <div className="p-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Products</h1>
          <p className="text-slate-400 text-sm">Monitor and manage all products</p>
        </div>

        <div className="flex items-center gap-3">
          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />

          <PermissionGuard required={PERMISSIONS_ENUM.PRODUCT_DEFINITIONS.VIEW}>
            <Tooltip content="Product Definition">
              <Link
                href="/product/productdefination"
                className="p-2.5 bg-slate-800/70 text-slate-400 hover:text-white rounded-xl border border-slate-700/60 hover:border-slate-600 transition-colors inline-flex items-center justify-center"
              >
                <FiSettings className="w-5 h-5" />
              </Link>
            </Tooltip>
          </PermissionGuard>

          <PermissionGuard required={PERMISSIONS_ENUM.PRODUCTS.ADD}>
            <button
              type="button"
              onClick={handleAddProduct}
              className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium text-sm transition-colors whitespace-nowrap flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </PermissionGuard>
        </div>
      </div>

      {/* Stats */}
      <ProductStats
        products={products || []}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        archivedFilter={archivedFilter}
        onArchivedChange={setArchivedFilter}
      />

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
        projectFilter={projectFilter}
        onProjectChange={setProjectFilter}
        fabricFilter={fabricFilter}
        onFabricChange={setFabricFilter}
        archivedFilter={archivedFilter}
        onArchivedChange={setArchivedFilter}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        products={products || []}
        projects={projects || []}
      />

      {/* Content */}
      {filteredProducts.length === 0 ? (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden mt-6 p-10">
          <NoData title="No products found" message="Try adjusting filters or create a new product." />
        </div>
      ) : (
        <>
          {viewMode === "table" ? (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden mt-4">
              <ProductTable
                products={paginatedProducts}
                onChangeStatus={handleChangeStatus}
                onDelete={openDeleteModal}
              />
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
                totalItems={filteredProducts.length}
                startIndex={startIndex}
              />
            </div>
          ) : (
            <>
              <ProductGrid
                products={paginatedProducts}
                onChangeStatus={handleChangeStatus}
                onDelete={openDeleteModal}
              />
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
                totalItems={filteredProducts.length}
                startIndex={startIndex}
              />
            </>
          )}
        </>
      )}


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
