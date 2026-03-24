import React from "react";

export type ProductStatusBadgeProps = {
  status?: string;
  archived?: boolean;
};

const ProductStatusBadge: React.FC<ProductStatusBadgeProps> = ({ status, archived }) => {
  let label = status || "Pending";
  let cls = "bg-slate-100 text-slate-700";

  if (archived) {
    label = "Archived";
    cls = "bg-red-100 text-red-700";
  } else if ((status || "").toLowerCase() === "approved") {
    cls = "bg-green-100 text-green-800";
  } else if ((status || "").toLowerCase() === "sample") {
    cls = "bg-blue-100 text-blue-800";
  } else if ((status || "").toLowerCase() === "rejected") {
    cls = "bg-red-100 text-red-800";
  } else if (!status) {
    cls = "bg-yellow-100 text-yellow-800";
  }

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
};

export default ProductStatusBadge;
