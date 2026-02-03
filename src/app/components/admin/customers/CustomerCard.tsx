import React from "react";
import Link from "next/link";
import { GetClientsType } from "@/store/useClientStore";
import { getInitials } from "../users/getRoleColor";
import { StatusBadge } from "../common/StatusBadge";
import { Edit, Eye, Mail, Phone, Trash2, MapPin } from "lucide-react";
import PermissionGuard from "../../auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";

interface CardProps {
  customer: GetClientsType;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onCustomerClick: (customer: GetClientsType) => void;
}

const CustomerCard: React.FC<CardProps> = ({
  customer,
  onEdit,
  onDelete,
  onCustomerClick,
}) => {
  return (
    <div
      key={customer.Id}
      className="flex flex-col rounded-xl border border-gray-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-900/90 hover:shadow-lg hover:border-blue-300/80 dark:hover:border-blue-500/80 transition-all"
    >
      {/* Header */}
      <div className="flex items-start gap-3 px-4 pt-4 pb-3 border-b border-gray-100 dark:border-slate-800">
        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-sm font-semibold text-white">
          {getInitials(customer.Name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {customer.Name}
            </h3>
            <StatusBadge status={customer.status || "Active"} />
          </div>
          {customer.CompleteAddress && (
            <div className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <MapPin className="w-3.5 h-3.5" />
              <span className="line-clamp-1">{customer.CompleteAddress}</span>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3 grid grid-cols-1 gap-2 text-xs text-gray-700 dark:text-gray-300">
        <div className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5 text-gray-600" />
          <span className="truncate text-gray-600">{customer.Phone || "-"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="w-3.5 h-3.5 text-gray-600" />
          <span className="truncate text-gray-600">{customer.Email || "-"}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-3 pt-2 border-t border-gray-100 dark:border-slate-800 flex items-center justify-center gap-2">
        <Link
          href={`/client/${customer.Id}`}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-600 dark:border-slate-700 text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
     >
          <Eye className="w-3.5 h-3.5" />
        </Link>

        <PermissionGuard required={PERMISSIONS_ENUM.CLIENTS.UPDATE}>
          <button
            type="button"
            onClick={() => onEdit(customer.Id)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 dark:border-slate-700 text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
        </PermissionGuard>

        <PermissionGuard required={PERMISSIONS_ENUM.CLIENTS.DELETE}>
          <button
            type="button"
            onClick={() => onDelete(customer.Id)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200/80 dark:border-red-800 text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/40 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </PermissionGuard>
      </div>
    </div>
  );
};

export default CustomerCard;
