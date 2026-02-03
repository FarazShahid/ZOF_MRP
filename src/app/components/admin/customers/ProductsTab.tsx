"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, Search, X, ArrowRight, Edit, Trash2, Eye } from "lucide-react";
import { Card } from "@heroui/react";
import { Product } from "@/store/useProductStore";
import { formatDate, getStatusColor } from "./clientHelpers";
import { useDocumentCenterStore } from "@/store/useDocumentCenterStore";
import { DOCUMENT_REFERENCE_TYPE } from "@/interface";
import { TbStatusChange } from "react-icons/tb";
import PermissionGuard from "../../auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import useProductStore from "@/store/useProductStore";
import DeleteProduct from "../../../products/DeleteProduct";

const ProductsTab: React.FC<{ products: Product[] }> = ({ products }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [fabricFilter, setFabricFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  // Extract unique values for filters
  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(products.map((p) => p.ProductCategoryName))
    ).sort();
    return unique;
  }, [products]);

  const fabrics = useMemo(() => {
    const unique = Array.from(
      new Set(products.map((p) => `${p.FabricName} (${p.FabricType})`))
    ).sort();
    return unique;
  }, [products]);

  const statuses = useMemo(() => {
    const unique = Array.from(
      new Set(products.map((p) => p.productStatus || "Pending"))
    ).sort();
    return unique;
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      // Search filter
      const matchesSearch =
        term === "" ||
        product.Name.toLowerCase().includes(term) ||
        (product.Description || "").toLowerCase().includes(term) ||
        product.ProductCategoryName.toLowerCase().includes(term) ||
        product.FabricName.toLowerCase().includes(term) ||
        product.FabricType.toLowerCase().includes(term);

      // Status filter
      const matchesStatus =
        statusFilter === "all" ||
        (product.productStatus || "Pending") === statusFilter;

      // Category filter
      const matchesCategory =
        categoryFilter === "all" ||
        product.ProductCategoryName === categoryFilter;

      // Fabric filter
      const matchesFabric =
        fabricFilter === "all" ||
        `${product.FabricName} (${product.FabricType})` === fabricFilter;

      return matchesSearch && matchesStatus && matchesCategory && matchesFabric;
    });
  }, [products, searchTerm, statusFilter, categoryFilter, fabricFilter]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setFabricFilter("all");
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    statusFilter !== "all" ||
    categoryFilter !== "all" ||
    fabricFilter !== "all";

  // Pagination over filtered products
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / itemsPerPage)
  );
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const openDeleteModal = (id: number) => {
    setSelectedProductId(id);
    setIsOpenDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setIsOpenDeleteModal(false);
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">No products found for this client.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900/60">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products by name, description, category, or fabric..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="min-w-[150px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="all">All Status</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="min-w-[150px]">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Fabric Filter */}
          <div className="min-w-[150px]">
            <select
              value={fabricFilter}
              onChange={(e) => setFabricFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="all">All Fabrics</option>
              {fabrics.map((fabric) => (
                <option key={fabric} value={fabric}>
                  {fabric}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600">
          <div>
            Showing {filteredProducts.length} of {products.length} products
            {hasActiveFilters && (
              <span className="ml-2 text-blue-600 dark:text-blue-400">
                (filtered)
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              Cards per page
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-xs bg-white dark:bg-slate-900"
            >
              {[6, 9, 12].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            No products match your filters.
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.Id}
                product={product}
                onDelete={openDeleteModal}
              />
            ))}
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-3 text-xs text-gray-600 dark:text-gray-400">
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {isOpenDeleteModal && selectedProductId !== null && (
        <DeleteProduct
          isOpen={isOpenDeleteModal}
          onClose={closeDeleteModal}
          productId={selectedProductId}
        />
      )}
    </div>
  );
};

// Product Card Component
interface ProductCardProps {
  product: Product;
  onDelete: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete }) => {
  const router = useRouter();
  const { changeProductStatus } = useProductStore();
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
  const { fetchDocuments, documentsByReferenceId } = useDocumentCenterStore();
  
  const documents = documentsByReferenceId[product.Id] || [];
  
  const imageDocs = useMemo(() => {
    return (documents || []).filter((d: any) =>
      imageExtensions.includes(d?.fileType?.toLowerCase())
    );
  }, [documents]);

  useEffect(() => {
    fetchDocuments(DOCUMENT_REFERENCE_TYPE.PRODUCT, product.Id);
  }, [product.Id]);

  const firstImage = imageDocs.length > 0 ? imageDocs[0] : null;

  const handleView = () => router.push(`/product/${product.Id}`);
  const handleEdit = () => router.push(`/product/editproduct/${product.Id}`);
  const handleChangeStatus = () =>
    changeProductStatus(product.Id, !product.isArchived, () => {});
  const handleDelete = () => onDelete(product.Id);

  return (
    <Card className="group overflow-hidden bg-white dark:bg-slate-900/95 rounded-2xl shadow-sm hover:shadow-2xl transition-all border border-transparent hover:border-blue-300/80 dark:hover:border-blue-500/80">
      {/* Image / Status */}
      <div className="relative h-44 bg-gray-50 dark:bg-slate-800">
        {firstImage ? (
          <img
            src={firstImage.fileUrl}
            alt={product.Name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 dark:text-gray-500">
            No image
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${getStatusColor(
              product.productStatus
            )}`}
          >
            {product.productStatus || "Pending"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Header */}
        <div>
          <button
            type="button"
            onClick={handleView}
            className="block text-left w-full"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base truncate hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {product.Name}
            </h3>
          </button>
          {product.Description && (
            <p className="mt-1 text-xs text-gray-600 line-clamp-2">
              {product.Description}
            </p>
          )}
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-1 gap-2 text-xs">
          <div className="flex flex-col rounded-md bg-gray-50 dark:bg-slate-800/80 p-2">
            <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">
              Category
            </span>
            <span className="mt-0.5 font-semibold text-gray-900 truncate">
              {product.ProductCategoryName}
            </span>
          </div>

          <div className="flex flex-col rounded-md bg-gray-50 dark:bg-slate-800/80 p-2">
            <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">
              Fabric
            </span>
            <span className="mt-0.5 font-semibold text-gray-900 truncate">
              {product.FabricName} ({product.FabricType})
            </span>
          </div>

          <div className="flex items-center justify-between rounded-md bg-gray-50 dark:bg-slate-800/80 p-2">
            <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">
              GSM
            </span>
            <span className="text-sm font-semibold text-gray-900">
              {product.GSM}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-gray-100 dark:border-slate-700 space-y-2 text-[11px] text-gray-500">
          <div className="flex items-center justify-between">
            <span>Created {formatDate(product.CreatedOn)}</span>
          </div>
          <div className="flex items-center justify-end gap-1.5">
            <PermissionGuard required={PERMISSIONS_ENUM.PRODUCTS.CHANGE_STATUS}>
              <button
                type="button"
                onClick={handleChangeStatus}
                className="inline-flex h-7 px-2 items-center gap-1 rounded-md border border-blue-200/80 dark:border-blue-800 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-[11px]"
              >
                <TbStatusChange size={14} />
                <span>Change</span>
              </button>
            </PermissionGuard>

            <PermissionGuard required={PERMISSIONS_ENUM.PRODUCTS.UPDATE}>
              <button
                type="button"
                onClick={handleEdit}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 dark:border-slate-700 text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
            </PermissionGuard>

            <button
              type="button"
              onClick={handleView}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 dark:border-slate-700 text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-800"
              title="View"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>

            <PermissionGuard required={PERMISSIONS_ENUM.PRODUCTS.DELETE}>
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-red-200/80 dark:border-red-800 text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/40"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </PermissionGuard>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductsTab;


