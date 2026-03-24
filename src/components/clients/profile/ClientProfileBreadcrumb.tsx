"use client";

import Link from "next/link";
import { GetClientsType } from "@/store/useClientStore";

interface ClientProfileBreadcrumbProps {
  client: GetClientsType;
}

export default function ClientProfileBreadcrumb({ client }: ClientProfileBreadcrumbProps) {
  return (
    <div className="flex items-center gap-2 mb-6 text-sm">
      <Link
        href="/client"
        className="text-slate-400 hover:text-white transition-colors"
      >
        Clients
      </Link>
      <i className="ri-arrow-right-s-line text-slate-600 w-4 h-4 flex items-center justify-center"></i>
      <span className="text-white">{client.Name}</span>
    </div>
  );
}
