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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-4">
      {products.map((p) => (
        <div
          key={p.Id}
          className="group bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-800/60 overflow-hidden hover:border-slate-700 hover:shadow-lg hover:shadow-black/20 transition-all duration-200"
        >
          {/* Image / Icon area */}
          <div className="aspect-[4/3] bg-gradient-to-br from-slate-800/80 to-slate-900 relative overflow-hidden flex items-center justify-center">
            <Package className="w-28 h-28 text-slate-700 group-hover:scale-110 transition-transform duration-300" />
            <span className="absolute top-3 right-3">
              <ProductStatusBadge status={p.productStatus} archived={p.isArchived} />
            </span>
          </div>

          {/* Header */}
          <div className="px-4 pt-4 pb-3">
            <h3 className="text-white font-bold text-base mb-0.5 truncate">{p.Name}</h3>
            <p className="text-xs text-slate-500 font-medium">#{p.Id} &middot; {p.ClientName}</p>
          </div>

          {/* Details */}
          <div className="px-4 pt-3 pb-4">
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Category</span>
                <span className="text-slate-200 font-medium">{p.ProductCategoryName}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Client</span>
                <span className="text-slate-200 font-medium">{p.ClientName}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">GSM</span>
                <span className="text-slate-200 font-medium">{p.GSM}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <PermissionGuard required={PERMISSIONS_ENUM.PRODUCTS.VIEW}>
                <button
                  type="button"
                  onClick={() => router.push(`/product/${p.Id}`)}
                  className="flex-1 px-3 py-2 bg-green-50 text-green-700 hover:bg-green-700 hover:text-white dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-600 dark:hover:text-white rounded-xl text-sm font-medium text-center transition-colors whitespace-nowrap"
                >
                  View Details
                </button>
              </PermissionGuard>
              <div className="flex items-center gap-1">
                <PermissionGuard required={PERMISSIONS_ENUM.PRODUCTS.CHANGE_STATUS}>
                  <button
                    type="button"
                    onClick={() => onChangeStatus(p.Id, p.isArchived)}
                    className="p-2 text-amber-400 bg-amber-500/10 hover:bg-amber-600 hover:text-white border border-amber-500/20 hover:border-amber-600 rounded-xl transition-colors"
                    title="Change Status"
                  >
                    <TbStatusChange size={16} />
                  </button>
                </PermissionGuard>
                <PermissionGuard required={PERMISSIONS_ENUM.PRODUCTS.UPDATE}>
                  <button
                    type="button"
                    onClick={() => handleEdit(p.Id)}
                    className="p-2 text-slate-300 bg-slate-700/30 hover:bg-slate-600 hover:text-white border border-slate-600/30 hover:border-slate-600 rounded-xl transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </PermissionGuard>
                <PermissionGuard required={PERMISSIONS_ENUM.PRODUCTS.DELETE}>
                  <button
                    type="button"
                    onClick={() => onDelete(p.Id)}
                    className="p-2 text-red-400 bg-red-500/10 hover:bg-red-600 hover:text-white border border-red-500/20 hover:border-red-600 rounded-xl transition-colors"
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
