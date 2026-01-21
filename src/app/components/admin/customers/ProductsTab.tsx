"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Package, Search, X, ArrowRight } from "lucide-react";
import { Card, Chip } from "@heroui/react";
import { Product } from "@/store/useProductStore";
import { formatDate, getStatusColor } from "./clientHelpers";
import { useDocumentCenterStore } from "@/store/useDocumentCenterStore";
import { DOCUMENT_REFERENCE_TYPE } from "@/interface";

const ProductsTab: React.FC<{ products: Product[] }> = ({ products }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [fabricFilter, setFabricFilter] = useState<string>("all");

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
      <div className="rounded-lg p-4 border border-gray-200 dark:border-gray-700">
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
        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredProducts.length} of {products.length} products
          {hasActiveFilters && (
            <span className="ml-2 text-blue-600 dark:text-blue-400">
              (filtered)
            </span>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.Id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

// Product Card Component
interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
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

  return (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg">
      <div className="relative">
        {/* Status Badge */}
        <div className="absolute top-4 right-4 z-10">
          <span className={`px-2 py-1 rounded-full text-xs font-medium shrink-0 ${getStatusColor(product.productStatus)}`}>
            {product.productStatus || "Pending"}
          </span>
        </div>

        {/* Product Image */}
        {firstImage && (
          <div className="relative overflow-hidden">
            <img
              src={firstImage.fileUrl}
              alt={product.Name}
              className="w-full h-56 object-cover object-top group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        )}

        <div className="p-5">
          {/* Header */}
          <div className="mb-4">
            <Link
              href={`/product/${product.Id}`}
              className="block"
            >
              <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {product.Name}
              </h3>
            </Link>
            {product.Description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {product.Description}
              </p>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-3 mb-5">
            <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-500 rounded-lg">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Category
              </span>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-1">
                {product.ProductCategoryName}
              </p>
            </div>

            <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-500 rounded-lg">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Fabric Type
              </span>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-1">
                {product.FabricName} ({product.FabricType})
              </p>
            </div>

            <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-500 rounded-lg">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                GSM
              </span>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-1">
                {product.GSM}
              </p>
            </div>
          </div>

          {/* Meta Info */}
          <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mb-4">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Created</span>
              <span className="font-medium">{formatDate(product.CreatedOn)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end">
            <Link
              href={`/product/${product.Id}`}
              className="inline-flex items-center gap-1 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors font-medium"
            >
              <span>View Details</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductsTab;


