"use client";

import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AdminDashboardLayout from "../../../components/common/AdminDashboardLayout";
import PermissionGuard from "../../../components/auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import useClientStore from "@/store/useClientStore";
import useProductStore from "@/store/useProductStore";
import Breadcrumbs from "@/src/app/components/gallery/Breadcrumbs";
import FolderCard from "@/src/app/components/gallery/FolderCard";
import ProductTabs from "@/src/app/components/product/ProductTabs";
 

const GalleryClientCategoriesPage = () => {
  const params = useParams<{ clientId: string }>();
  const clientId = Number(params.clientId);

  const clients = useClientStore((s) => s.clients);
  const fetchClients = useClientStore((s) => s.fetchClients);

  const products = useProductStore((s) => s.products);
  const loading = useProductStore((s) => s.loading);
  const fetchProducts = useProductStore((s) => s.fetchProducts);

  useEffect(() => {
    if (!clients || clients.length === 0) fetchClients();
    if (!products || products.length === 0) fetchProducts();
  }, [clients?.length, products?.length, fetchClients, fetchProducts]);

  const client = useMemo(() => clients.find((c) => c.Id === clientId), [clients, clientId]);

  const categoriesForClient = useMemo(() => {
    const map = new Map<number, { id: number; name: string; count: number }>();
    for (const p of products || []) {
      if (p.ClientId !== clientId) continue;
      const existing = map.get(p.ProductCategoryId);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(p.ProductCategoryId, {
          id: p.ProductCategoryId,
          name: p.ProductCategoryName,
          count: 1,
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [products, clientId]);

  const totalCount = useMemo(() => {
    let count = 0;
    for (const p of products || []) if (p.ClientId === clientId) count += 1;
    return count;
  }, [products, clientId]);

  return (
    <AdminDashboardLayout>
      <PermissionGuard required={PERMISSIONS_ENUM.PRODUCTS.VIEW}>
        <div className="flex flex-col gap-4">
          <ProductTabs />
          <Breadcrumbs
            items={[
              { label: "Clients", href: "/product/gallery" },
              { label: client?.Name || `Client #${clientId}` },
            ]}
          />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{client?.Name || "Client"}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Choose a category or view all products for this client.</p>
          </div>

          {loading ? (
            <div className="text-sm text-gray-500 dark:text-gray-400">Loading…</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
              <FolderCard
                key="all"
                title="All products"
                subtitle={`${totalCount} product${totalCount === 1 ? "" : "s"}`}
                href={`/product/gallery/${clientId}/all`}
              />

              {categoriesForClient.length === 0 ? (
                <div className="col-span-full text-sm text-gray-500 dark:text-gray-400">No categories found for this client.</div>
              ) : (
                categoriesForClient.map((cat) => (
                  <FolderCard
                    key={cat.id}
                    title={cat.name}
                    subtitle={`${cat.count} item${cat.count === 1 ? "" : "s"}`}
                    href={`/product/gallery/${clientId}/${cat.id}`}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </PermissionGuard>
    </AdminDashboardLayout>
  );
};

export default GalleryClientCategoriesPage;


