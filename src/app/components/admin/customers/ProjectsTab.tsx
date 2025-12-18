"use client";

import React, { useMemo, useState, useEffect } from "react";
import useClientStore, { ProjectType } from "@/store/useClientStore";
import useOrderStore from "@/store/useOrderStore";
import { Product } from "@/store/useProductStore";
import { GetOrdersType } from "@/src/app/interfaces/OrderStoreInterface";
import { Search, Package2 } from "lucide-react";

interface Props {
  clientId: number;
  products: Product[];
  orders: GetOrdersType[];
}

const ProjectsTab: React.FC<Props> = ({ clientId, products, orders }) => {
  const { projects, loading } = useClientStore();
  const { OrderItemById, getOrderItemsByOrderId, loading: ordersLoading } = useOrderStore();

  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [search, setSearch] = useState<string>("");

  const clientProjects: ProjectType[] = useMemo(
    () => projects.filter((p) => p.ClientId === clientId),
    [projects, clientId]
  );

  const visibleProjects = useMemo(() => {
    if (!search.trim()) return clientProjects;
    const term = search.toLowerCase();
    return clientProjects.filter((p) => p.Name.toLowerCase().includes(term));
  }, [clientProjects, search]);

  // When a project is selected, fetch all order items for visible orders (once per selection)
  useEffect(() => {
    if (!selectedProjectId) return;
    const orderIds = orders.map((o) => o.Id);
    if (orderIds.length > 0) {
      getOrderItemsByOrderId(orderIds);
    }
  }, [selectedProjectId, orders]);

  // Compute products under selected project
  const projectProducts = useMemo(() => {
    if (!selectedProjectId) return [];
    return (products || []).filter((p) => Number(p.ProjectId) === Number(selectedProjectId));
  }, [selectedProjectId, products]);

  // Compute orders that contain any of the project products
  const relatedOrders = useMemo(() => {
    if (!selectedProjectId) return [];
    const productIds = new Set(projectProducts.map((p) => p.Id));
    const orderNumbers = new Set(
      (OrderItemById || [])
        .filter((item: any) => productIds.has(item.ProductId))
        .map((item: any) => item.OrderNumber)
    );
    return (orders || []).filter((o) => orderNumbers.has(o.OrderNumber));
  }, [selectedProjectId, projectProducts, OrderItemById, orders]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Projects</h3>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-gray-500 dark:text-gray-400">Loading projects...</div>
        </div>
      ) : clientProjects.length === 0 ? (
        <div className="flex items-center justify-center min-h-[200px] border border-dashed rounded-lg dark:border-gray-700 border-gray-200 bg-white dark:bg-slate-900">
          <div className="text-center px-6 py-8">
            <div className="text-gray-600 dark:text-gray-400 font-medium">No projects yet</div>
            <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Use the “Create New Project” button in the header to add one.
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Project list */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects..."
                className="pl-9 pr-3 py-2 w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              {visibleProjects.map((proj) => {
                const isActive = selectedProjectId === proj.Id;
                const projProductsCount = (products || []).filter((p) => Number(p.ProjectId) === Number(proj.Id)).length;
                return (
                  <li
                    key={proj.Id}
                    className={`p-4 cursor-pointer transition-colors ${isActive ? "bg-blue-50/70 dark:bg-slate-800" : "hover:bg-gray-50 dark:hover:bg-slate-800/50"}`}
                    onClick={() => setSelectedProjectId(proj.Id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{proj.Name}</div>
                        {proj.Description ? (
                          <div className="text-sm text-gray-500">{proj.Description}</div>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                          <Package2 className="w-3 h-3" />
                          {projProductsCount}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
              {visibleProjects.length === 0 && (
                <li className="p-4 text-sm text-gray-500 dark:text-gray-400">No matching projects</li>
              )}
            </ul>
          </div>

          {/* Details panel */}
          <div className="md:col-span-2 space-y-4">
            {!selectedProjectId ? (
              <div className="flex items-center justify-center min-h-[200px] border border-dashed rounded-lg dark:border-gray-700 border-gray-200 bg-white dark:bg-slate-900">
                <div className="text-center px-6 py-8 text-gray-600 dark:text-gray-400">
                  Select a project to view its products and orders.
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Products in this project</h4>
                  {projectProducts.length === 0 ? (
                    <div className="text-sm text-gray-500">No products linked to this project.</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {projectProducts.map((p) => (
                        <div key={p.Id} className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-slate-900">
                          <div className="font-medium truncate" title={(p as any).ProductName ?? p.Name}>
                            {p.Name || (p as any).ProductName}
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-800">
                              {p.ProductCategoryName}
                            </span>
                            {p.FabricName && (
                              <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-800">
                                {p.FabricName}
                              </span>
                            )}
                            {p.productStatus && (
                              <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                {p.productStatus}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Orders containing these products</h4>
                  {ordersLoading && (
                    <div className="text-sm text-gray-500 mb-2">Loading order items…</div>
                  )}
                  {relatedOrders.length === 0 ? (
                    <div className="text-sm text-gray-500">No orders found for these products.</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {relatedOrders.map((o) => (
                        <div key={o.Id} className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-slate-900 text-sm">
                          <div className="font-medium">{o.OrderName || o.OrderNumber}</div>
                          <div className="text-xs text-gray-500">#{o.OrderNumber}</div>
                          <div className="mt-2 flex items-center gap-2 text-xs">
                            <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-800">
                              {o.StatusName}
                            </span>
                            {o.Deadline && (
                              <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-800">
                                {o.Deadline?.slice(0, 10)}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProjectsTab;


