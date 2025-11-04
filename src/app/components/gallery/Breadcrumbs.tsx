"use client";

import Link from "next/link";

interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <nav className="mb-2" aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 flex-wrap text-[13px]">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link href={item.href} className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">
                  {item.label}
                </span>
              )}
              {!isLast ? <span className="text-gray-400">›</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;


