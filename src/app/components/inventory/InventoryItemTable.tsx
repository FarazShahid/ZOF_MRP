import React from "react";
import { Eye, Edit, Trash2, Package } from "lucide-react";
import PermissionGuard from "../auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import { InventoryItemResponse } from "@/store/useInventoryItemsStore";

interface Props {
  items: InventoryItemResponse[];
  onView?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const InventoryItemTable: React.FC<Props> = ({ items, onView, onEdit, onDelete }) => {
  const formatDate = (iso?: string) =>
    iso
      ? new Date(iso).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "-";

  return (
    <div className="rounded-lg border border-slate-200 dark:border-gray-50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-white dark:bg-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Item
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Sub Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                UOM
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Supplier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Reorder Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Updated
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-900 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items.map((it) => (
              <tr key={it.Id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors even:bg-green-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Package className="w-4 h-4 text-slate-400 mr-2" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">{it.Name}</span>
                      <span className="text-xs text-slate-500">{it.ItemCode}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{it.CategoryId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{it.SubCategoryName || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{it.UnitOfMeasureShortForm || it.UnitOfMeasureName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{it.SupplierName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{it.Stock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{it.ReorderLevel}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(it.CreatedOn)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(it.UpdatedOn)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onView?.(it.Id)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View"
                      type="button"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <PermissionGuard required={PERMISSIONS_ENUM.INVENTORY_ITEMS.UPDATE}>
                      <button
                        onClick={() => onEdit?.(it.Id)}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                        title="Edit"
                        type="button"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </PermissionGuard>

                    <PermissionGuard required={PERMISSIONS_ENUM.INVENTORY_ITEMS.DELETE}>
                      <button
                        onClick={() => onDelete?.(it.Id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                        type="button"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </PermissionGuard>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={10} className="px-6 py-12 text-center text-slate-500">
                  No inventory items match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryItemTable;


