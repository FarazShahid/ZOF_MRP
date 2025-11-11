"use client";

import React, { useState } from "react";
import { Eye, Edit, Trash2, Package, Layers, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import ProductStatusBadge from "./ProductStatusBadge";
import { Product } from "@/store/useProductStore";
import { TbStatusChange } from "react-icons/tb";
import PermissionGuard from "../auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";

interface Props {
  products: Product[];
  onChangeStatus: (id: number, status: boolean) => void;
  onDelete: (id: number) => void;
}

const ProductGrid: React.FC<Props> = ({
  products,
  onChangeStatus,
  onDelete,
}) => {
  const router = useRouter();

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const handleEdit = (id: number) => router.push(`/product/editproduct/${id}`);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
      {products.map((p) => (
        <div
          key={p.Id}
          className="rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-gray-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">{p.Name}</h3>
                  <p className="text-sm text-gray-600">{p.ClientName}</p>
                </div>
              </div>
              <ProductStatusBadge
                status={p.productStatus}
                archived={p.isArchived}
              />
            </div>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700">{p.ProductCategoryName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700">
                {p.FabricType} — {p.FabricName} · {p.GSM} GSM
              </span>
            </div>
            <div className="text-slate-500">
              Created:{" "}
              <span className="text-gray-700">{formatDate(p.CreatedOn)}</span>
            </div>
            {p.Description && (
              <p className="text-slate-600 mt-1 line-clamp-2">
                {p.Description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="px-4 py-3 rounded-b-lg border-t border-slate-200">
            <div className="flex items-center justify-end space-x-2">
              <PermissionGuard
                required={PERMISSIONS_ENUM.PRODUCTS.CHANGE_STATUS}
              >
                <button
                  type="button"
                  onClick={() => onChangeStatus(p.Id, p.isArchived)}
                  className="flex items-center space-x-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <TbStatusChange size={18} />
                  <span>Change Status</span>
                </button>
              </PermissionGuard>

              <PermissionGuard required={PERMISSIONS_ENUM.PRODUCTS.UPDATE}>
                <button
                  type="button"
                  onClick={() => handleEdit(p.Id)}
                  className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-slate-100 rounded-md transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              </PermissionGuard>

              <button
                type="button"
                onClick={() => router.push(`/product/${p.Id}`)}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-slate-100 rounded-md transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>

              <PermissionGuard required={PERMISSIONS_ENUM.PRODUCTS.DELETE}>
                <button
                  type="button"
                  onClick={() => onDelete(p.Id)}
                  className="flex items-center space-x-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </PermissionGuard>
            </div>
          </div>
        </div>
      ))}
      {products.length === 0 && (
        <div className="col-span-full text-center text-slate-500 py-12">
          No products match your filters.
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
