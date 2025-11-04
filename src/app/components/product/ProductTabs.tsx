"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ProductTabs = () => {
  const pathname = usePathname();
  const isGallery = pathname.startsWith("/product/gallery");

  const baseClasses = "px-4 py-2 text-sm rounded-md transition-colors";
  const activeClasses = "bg-blue-600 text-white hover:bg-blue-600";
  const inactiveClasses = "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800";

  return (
    <div className="w-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-800 rounded-lg p-1 inline-flex gap-1">
      <Link
        href="/product"
        className={`${baseClasses} ${!isGallery ? activeClasses : inactiveClasses}`}
      >
        All Products
      </Link>
      <Link
        href="/product/gallery"
        className={`${baseClasses} ${isGallery ? activeClasses : inactiveClasses}`}
      >
        Gallery by Client
      </Link>
    </div>
  );
};

export default ProductTabs;


