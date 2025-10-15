import React, { useState } from "react";
import { Eye, Edit, Trash2, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import ProductStatusBadge from "./ProductStatusBadge";
import { Product } from "@/store/useProductStore";
import { TbStatusChange } from "react-icons/tb";
import PermissionGuard from "../auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import ViewProductDetails from "./ViewProductDetails";

interface Props {
  products: Product[];
  onChangeStatus: (id: number, status: boolean) => void;
  onDelete: (id: number) => void;
}

const ProductTable: React.FC<Props> = ({
  products,
  onChangeStatus,
  onDelete,
}) => {
  const router = useRouter();
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const handleEdit = (id: number) => router.push(`/product/editproduct/${id}`);
  const handleView = (id: number) => {
    setSelectedId(id);
    setIsViewOpen(true);
  };

  return (
    <div className="rounded-lg border border-slate-200 dark:border-gray-50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-white dark:bg-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Fabric
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                GSM
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-900 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {products.map((p) => (
              <tr
                key={p.Id}
                className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors even:bg-green-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Package className="w-4 h-4 text-slate-400 mr-2" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {p.Name}
                      </span>
                      <span className="text-xs text-slate-500">#{p.Id}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {p.ProductCategoryName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {p.ClientName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {p.FabricType} — {" "}
                  <span className="text-slate-600">{p.FabricName}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {p.GSM}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ProductStatusBadge
                    status={p.productStatus}
                    archived={p.isArchived}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(p.CreatedOn)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <PermissionGuard
                      required={PERMISSIONS_ENUM.PRODUCTS.VIEW}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(p.Id);
                        }}
                        className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="View"
                        type="button"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </PermissionGuard>

                    <PermissionGuard
                      required={PERMISSIONS_ENUM.PRODUCTS.CHANGE_STATUS}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onChangeStatus(p.Id, p.isArchived);
                        }}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Change Status"
                      >
                        <TbStatusChange size={18} />
                      </button>
                    </PermissionGuard>

                    <PermissionGuard required={PERMISSIONS_ENUM.PRODUCTS.UPDATE}>
                      <button
                        onClick={() => handleEdit(p.Id)}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                        title="Edit"
                        type="button"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </PermissionGuard>

                    <PermissionGuard required={PERMISSIONS_ENUM.PRODUCTS.DELETE}>
                      <button
                        onClick={() => onDelete(p.Id)}
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
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  No products match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ViewProductDetails
        isOpen={isViewOpen}
        productId={selectedId}
        onClose={() => setIsViewOpen(false)}
      />
    </div>
  );
};

export default ProductTable;
