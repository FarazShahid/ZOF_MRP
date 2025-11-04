"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import AdminDashboardLayout from "../../components/common/AdminDashboardLayout";
import PermissionGuard from "../../components/auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import useClientStore from "@/store/useClientStore";
import useProductStore from "@/store/useProductStore";
import FolderCard from "@/src/app/components/gallery/FolderCard";
import ProductTabs from "@/src/app/components/product/ProductTabs";
 

const GalleryClientsPage = () => {
  const clients = useClientStore((s) => s.clients);
  const clientsLoading = useClientStore((s) => s.loading);
  const fetchClients = useClientStore((s) => s.fetchClients);

  const products = useProductStore((s) => s.products);
  const productsLoading = useProductStore((s) => s.loading);
  const fetchProducts = useProductStore((s) => s.fetchProducts);

  useEffect(() => {
    if (!clients || clients.length === 0) fetchClients();
    if (!products || products.length === 0) fetchProducts();
  }, [clients?.length, products?.length, fetchClients, fetchProducts]);

  const productCountByClient = useMemo(() => {
    const map = new Map<number, number>();
    for (const p of products || []) {
      map.set(p.ClientId, (map.get(p.ClientId) || 0) + 1);
    }
    return map;
  }, [products]);

  const isLoading = clientsLoading || productsLoading;

  return (
    <AdminDashboardLayout>
      <PermissionGuard required={PERMISSIONS_ENUM.PRODUCTS.VIEW}>
        <div className="flex flex-col gap-4">
          <ProductTabs />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Gallery by Client</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Open a client to see categories and products visually.</p>
          </div>

          {isLoading ? (
            <div className="text-sm text-gray-500 dark:text-gray-400">Loading…</div>
          ) : clients.length === 0 ? (
            <div className="text-sm text-gray-500 dark:text-gray-400">No clients found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
              {clients.map((client) => {
                const count = productCountByClient.get(client.Id) || 0;
                return (
                  <FolderCard
                    key={client.Id}
                    title={client.Name}
                    subtitle={`${count} product${count === 1 ? "" : "s"}`}
                    href={`/product/gallery/${client.Id}`}
                  />
                );
              })}
            </div>
          )}
        </div>
      </PermissionGuard>
    </AdminDashboardLayout>
  );
};

export default GalleryClientsPage;


