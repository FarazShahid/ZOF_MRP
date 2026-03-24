import React from "react";

export type ProductStatusBadgeProps = {
  status?: string;
  archived?: boolean;
};

const getStatusColor = (status?: string, archived?: boolean) => {
  if (archived) return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  const s = (status || "").toLowerCase();
  if (s === "approved") return "bg-green-500/20 text-green-400 border-green-500/30";
  if (s === "sample") return "bg-blue-500/20 text-blue-400 border-blue-500/30";
  if (s === "rejected") return "bg-red-500/20 text-red-400 border-red-500/30";
  return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
};

const ProductStatusBadge: React.FC<ProductStatusBadgeProps> = ({ status, archived }) => {
  const label = archived ? "Archived" : (status ? status.charAt(0).toUpperCase() + status.slice(1) : "Pending");
  const cls = getStatusColor(status, archived);

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${cls} whitespace-nowrap`}>
      {label}
    </span>
  );
};

export default ProductStatusBadge;
