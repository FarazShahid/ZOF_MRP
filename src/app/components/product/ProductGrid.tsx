"use client";

import React from "react";
import { Eye, Edit, Trash2, Package } from "lucide-react";
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

  const handleEdit = (id: number) => router.push(`/product/editproduct/${id}`);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((p) => (
        <div
          key={p.Id}
          className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:border-slate-700 transition-all"
        >
          <div className="aspect-square bg-slate-800 relative overflow-hidden flex items-center justify-center">
            <Package className="w-16 h-16 text-slate-600" />
            <span className="absolute top-3 right-3">
              <ProductStatusBadge status={p.productStatus} archived={p.isArchived} />
            </span>
          </div>

          <div className="p-5">
            <h3 className="text-white font-semibold mb-1">{p.Name}</h3>
            <p className="text-xs text-slate-500 mb-3">#{p.Id}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Category:</span>
                <span className="text-slate-300">{p.ProductCategoryName}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Client:</span>
                <span className="text-slate-300">{p.ClientName}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">GSM:</span>
                <span className="text-slate-300">{p.GSM}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <PermissionGuard required={PERMISSIONS_ENUM.PRODUCTS.VIEW}>
                <button
                  type="button"
                  onClick={() => router.push(`/product/${p.Id}`)}
                  className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium text-center transition-colors whitespace-nowrap"
                >
                  View Details
                </button>
              </PermissionGuard>
              <div className="flex items-center gap-1">
                <PermissionGuard required={PERMISSIONS_ENUM.PRODUCTS.CHANGE_STATUS}>
                  <button
                    type="button"
                    onClick={() => onChangeStatus(p.Id, p.isArchived)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    title="Change Status"
                  >
                    <TbStatusChange size={18} />
                  </button>
                </PermissionGuard>
                <PermissionGuard required={PERMISSIONS_ENUM.PRODUCTS.UPDATE}>
                  <button
                    type="button"
                    onClick={() => handleEdit(p.Id)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </PermissionGuard>
                <PermissionGuard required={PERMISSIONS_ENUM.PRODUCTS.DELETE}>
                  <button
                    type="button"
                    onClick={() => onDelete(p.Id)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </PermissionGuard>
              </div>
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
