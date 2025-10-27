"use client";

import React from "react";
import { Package, Layers, Tag, Ruler, Warehouse, CalendarClock, Eye, Edit, Trash2, RefreshCwIcon } from "lucide-react";
import PermissionGuard from "../auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import { InventoryItemResponse } from "@/store/useInventoryItemsStore";

interface Props {
  items: InventoryItemResponse[];
  onView?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const InventoryItemGrid: React.FC<Props> = ({ items, onView, onEdit, onDelete }) => {
  const formatDate = (iso?: string) =>
    iso
      ? new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      : "-";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
      {items?.map((it) => (
        <div
          key={it.Id}
          className="rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-gray-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">{it.Name}</h3>
                  <p className="text-sm text-gray-600">{it.ItemCode}</p>
                </div>
              </div>
              <div className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
                Stock: {it.Stock}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-700">
                <Layers className="w-4 h-4" />
                <span className="font-medium">Category</span>
              </div>
              <span className="text-gray-900">{it.CategoryId}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-700">
                <Tag className="w-4 h-4" />
                <span className="font-medium">Sub Category</span>
              </div>
              <span className="text-gray-900">{it.SubCategoryName || "-"}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-700">
                <Ruler className="w-4 h-4" />
                <span className="font-medium">UOM</span>
              </div>
              <span className="text-gray-900">{it.UnitOfMeasureShortForm || it.UnitOfMeasureName}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-700">
                <Warehouse className="w-4 h-4" />
                <span className="font-medium">Supplier</span>
              </div>
              <span className="text-gray-900">{it.SupplierName}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-700">
                <RefreshCwIcon className="w-4 h-4" />
                <span className="font-medium">Reorder Level</span>
              </div>
              <span className="text-gray-900">{it.ReorderLevel}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-700">
                <CalendarClock className="w-4 h-4" />
                <span className="font-medium">Updated</span>
              </div>
              <span className="text-gray-900">{formatDate(it.UpdatedOn)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md text-blue-600 hover:bg-blue-50"
              onClick={() => onView?.(it.Id)}
            >
              <Eye className="w-4 h-4" /> View
            </button>
            <PermissionGuard required={PERMISSIONS_ENUM.INVENTORY_ITEMS.UPDATE}>
              <button
                type="button"
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md text-green-600 hover:bg-green-50"
                onClick={() => onEdit?.(it.Id)}
              >
                <Edit className="w-4 h-4" /> Edit
              </button>
            </PermissionGuard>
            <PermissionGuard required={PERMISSIONS_ENUM.INVENTORY_ITEMS.DELETE}>
              <button
                type="button"
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md text-red-600 hover:bg-red-50"
                onClick={() => onDelete?.(it.Id)}
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </PermissionGuard>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InventoryItemGrid;


