"use client";

import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AdminDashboardLayout from "../../../../components/common/AdminDashboardLayout";
import PermissionGuard from "../../../../components/auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import useClientStore from "@/store/useClientStore";
import useProductStore from "@/store/useProductStore";
import Breadcrumbs from "@/src/app/components/gallery/Breadcrumbs";
import ProductTile from "@/src/app/components/gallery/ProductTile";
import ProductTabs from "@/src/app/components/product/ProductTabs";
 

const GalleryClientCategoryProductsPage = () => {
  const params = useParams<{ clientId: string; categoryId: string }>();
  const clientId = Number(params.clientId);
  const categorySlug = params.categoryId;

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

  const filtered = useMemo(() => {
    if (!products) return [] as typeof products;
    const byClient = products.filter((p) => p.ClientId === clientId);
    if (categorySlug === "all") return byClient;
    const categoryId = Number(categorySlug);
    if (Number.isNaN(categoryId)) return byClient;
    return byClient.filter((p) => p.ProductCategoryId === categoryId);
  }, [products, clientId, categorySlug]);

  const categoryName = useMemo(() => {
    if (categorySlug === "all") return "All products";
    const id = Number(categorySlug);
    if (Number.isNaN(id)) return "Products";
    const sample = products.find((p) => p.ProductCategoryId === id);
    return sample?.ProductCategoryName || "Products";
  }, [products, categorySlug]);

  return (
    <AdminDashboardLayout>
      <PermissionGuard required={PERMISSIONS_ENUM.PRODUCTS.VIEW}>
        <div className="flex flex-col gap-4">
          <ProductTabs />
          <Breadcrumbs
            items={[
              { label: "Clients", href: "/product/gallery" },
              { label: client?.Name || `Client #${clientId}`, href: `/product/gallery/${clientId}` },
              { label: categoryName },
            ]}
          />
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{categoryName}</h1>

          {loading ? (
            <div className="text-sm text-gray-500 dark:text-gray-400">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="text-sm text-gray-500 dark:text-gray-400">No products found.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
              {filtered.map((p) => (
                <ProductTile key={p.Id} name={p.Name} category={p.ProductCategoryName} />
              ))}
            </div>
          )}
        </div>
      </PermissionGuard>
    </AdminDashboardLayout>
  );
};

export default GalleryClientCategoryProductsPage;


