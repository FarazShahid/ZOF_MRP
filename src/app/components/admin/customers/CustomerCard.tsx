import React from "react";
import { GetClientsType } from "@/store/useClientStore";
import { getInitials } from "../users/getRoleColor";
import { StatusBadge } from "../common/StatusBadge";
import { Edit, Eye, Mail, Phone, Trash2 } from "lucide-react";
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
      className=" rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-lg font-medium text-blue-700">
              {getInitials(customer.Name)}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {customer.Name}
            </h3>
            <StatusBadge status={customer.status || "Active"} />
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="w-4 h-4" />
          {customer.Phone}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail className="w-4 h-4" />
          {customer.Email}
        </div>
        {/* <div className="flex items-center justify-between pt-2">
          <span className="text-sm font-medium text-gray-900">
            0 Total Orders
          </span>
          <span className="text-xs text-gray-500">0 in progress</span>
        </div> */}
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
        <button
          onClick={() => onCustomerClick(customer)}
          className="flex items-center space-x-1 px-3 py-1.5 text-sm text-slate-600 bg-slate-200 rounded-md transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span>View</span>
        </button>

        <PermissionGuard required={PERMISSIONS_ENUM.ADMIN_SETTING.UPDATE}>
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
            onClick={() => onEdit(customer.Id)}
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
        </PermissionGuard>

        <PermissionGuard required={PERMISSIONS_ENUM.ADMIN_SETTING.DELETE}>
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors"
            onClick={() => onDelete(customer.Id)}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </PermissionGuard>
      </div>
    </div>
  );
};

export default CustomerCard;
