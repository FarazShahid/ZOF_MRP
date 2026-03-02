import React from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
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

const ProductTable: React.FC<Props> = ({
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
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-800">
            <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Product</th>
            <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</th>
            <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Client</th>
            <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Fabric</th>
            <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">GSM</th>
            <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
            <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Created</th>
            <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr
              key={p.Id}
              className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
            >
              <td className="px-6 py-4">
                <div>
                  <div className="text-sm font-medium text-white">{p.Name}</div>
                  <div className="text-xs text-slate-500">#{p.Id}</div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-300">{p.ProductCategoryName}</td>
              <td className="px-6 py-4 text-sm text-slate-300">{p.ClientName}</td>
              <td className="px-6 py-4 text-sm text-slate-300">{p.FabricType} — {p.FabricName}</td>
              <td className="px-6 py-4 text-sm text-slate-300">{p.GSM}</td>
              <td className="px-6 py-4">
                <ProductStatusBadge status={p.productStatus} archived={p.isArchived} />
              </td>
              <td className="px-6 py-4 text-sm text-slate-300">{formatDate(p.CreatedOn)}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <PermissionGuard required={PERMISSIONS_ENUM.PRODUCTS.VIEW}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/product/${p.Id}`);
                      }}
                      className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                      title="View"
                      type="button"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </PermissionGuard>
                  <PermissionGuard required={PERMISSIONS_ENUM.PRODUCTS.CHANGE_STATUS}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onChangeStatus(p.Id, p.isArchived);
                      }}
                      className="p-2 text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors"
                      title="Change Status"
                      type="button"
                    >
                      <TbStatusChange size={18} />
                    </button>
                  </PermissionGuard>
                  <PermissionGuard required={PERMISSIONS_ENUM.PRODUCTS.UPDATE}>
                    <button
                      onClick={() => handleEdit(p.Id)}
                      className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                      title="Edit"
                      type="button"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </PermissionGuard>
                  <PermissionGuard required={PERMISSIONS_ENUM.PRODUCTS.DELETE}>
                    <button
                      onClick={() => onDelete(p.Id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Archive / Delete"
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
              <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                No products match your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
