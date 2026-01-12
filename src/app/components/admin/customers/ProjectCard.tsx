"use client";

import React from "react";
import { ChevronDown, Package2, ClipboardList, Edit, Trash2, Eye } from "lucide-react";
import { ProjectType } from "@/store/useClientStore";
import { Product } from "@/store/useProductStore";
import { GetOrdersType } from "@/src/app/interfaces/OrderStoreInterface";
import ProductsSection from "./ProductsSection";
import OrdersSection from "./OrdersSection";

type Props = {
  project: ProjectType;
  isOpen: boolean;
  productCount: number;
  orderCount: number;

  products: Product[];
  orders: GetOrdersType[];

  productsLoading: boolean;
  ordersLoading: boolean;

  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

const ProjectCard: React.FC<Props> = React.memo(
  ({
    project,
    isOpen,
    productCount,
    orderCount,
    products,
    orders,
    productsLoading,
    ordersLoading,
    onToggle,
    onEdit,
    onDelete,
  }) => {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 overflow-hidden">
        {/* Header */}
        <div
          className="w-full flex items-center justify-between gap-3 p-4 hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
          onClick={(e) => {
            // Prevent clicks on buttons from triggering header toggle
            if ((e.target as HTMLElement).closest('button')) {
              return;
            }
            // Allow clicking on header to toggle expand/collapse
            onToggle();
          }}
        >
          <div className="text-left min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <div className="font-semibold truncate">{project.Name}</div>

              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                <Package2 className="w-3 h-3" />
                {productCount}
              </span>

              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                <ClipboardList className="w-3 h-3" />
                {orderCount}
              </span>
            </div>

            {project.Description ? (
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                {project.Description}
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-1.5">
            <IconButton 
              label="View Detail" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggle();
              }}
            >
              <Eye className="w-4 h-4" />
            </IconButton>
            <IconButton
              label="Edit project"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit();
              }}
            >
              <Edit className="w-4 h-4 " />
            </IconButton>

            <IconButton
              label="Delete project"
              danger
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="w-4 h-4" />
            </IconButton>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggle();
              }}
              className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded transition-colors"
              aria-label="Toggle expand"
            >
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Body - Expandable section showing products and orders */}
        {isOpen && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-6">
            <ProductsSection products={products} loading={productsLoading} />
            <OrdersSection orders={orders} loading={ordersLoading} />
          </div>
        )}
      </div>
    );
  }
);

function IconButton({
  children,
  label,
  danger,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  danger?: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={[
        "inline-flex items-center justify-center w-9 h-9 rounded-xl border transition-colors",
        danger
          ? "border-red-200/70 dark:border-red-800/60 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default ProjectCard;
