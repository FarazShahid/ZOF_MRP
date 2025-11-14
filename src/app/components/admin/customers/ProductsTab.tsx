"use client";

import React from "react";
import Link from "next/link";
import { Package, Layers, Tag, Hash, ArrowRight } from "lucide-react";
import { Product } from "@/store/useProductStore";
import { formatDate, getStatusColor } from "./clientHelpers";

const ProductsTab: React.FC<{ products: Product[] }> = ({ products }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">No products found for this client.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <div
          key={product.Id}
          className="group bg-gray-50 dark:bg-gray-900/50 rounded-lg p-5 border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <Link
                href={`/product/${product.Id}`}
                className="block truncate text-lg font-semibold text-gray-900 dark:text-white hover:underline"
              >
                {product.Name}
              </Link>
              {product.Description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                  {product.Description}
                </p>
              )}
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium shrink-0 ${getStatusColor(product.productStatus)}`}>
              {product.productStatus}
            </span>
          </div>

          {/* Meta */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Layers className="w-4 h-4 text-gray-500" />
              <span className="text-gray-500 dark:text-gray-400">Category</span>
              <span className="ml-1 text-gray-900 dark:text-white truncate">
                {product.ProductCategoryName}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Tag className="w-4 h-4 text-gray-500" />
              <span className="text-gray-500 dark:text-gray-400">Fabric</span>
              <span className="ml-1 text-gray-900 dark:text-white truncate">
                {product.FabricName} ({product.FabricType})
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Hash className="w-4 h-4 text-gray-500" />
              <span className="text-gray-500 dark:text-gray-400">GSM</span>
              <span className="ml-1 text-gray-900 dark:text-white">{product.GSM}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Package className="w-4 h-4 text-gray-500" />
              <span className="text-gray-500 dark:text-gray-400">Created</span>
              <span className="ml-1 text-gray-900 dark:text-white">{formatDate(product.CreatedOn)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex justify-end">
            <Link
              href={`/product/${product.Id}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              <span>View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsTab;


