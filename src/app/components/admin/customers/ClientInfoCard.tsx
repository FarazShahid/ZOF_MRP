"use client";

import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  ArrowLeft,
  Building2,
} from "lucide-react";
import { GetClientsType } from "@/store/useClientStore";
import { getStatusColor } from "./clientHelpers";
import Link from "next/link";

const ClientInfoCard: React.FC<{ client: GetClientsType }> = ({ client }) => {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-gray-200/80 dark:border-slate-700/80 bg-gradient-to-r from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 shadow-sm">
      {/* Decorative background icon */}
      <div className="pointer-events-none absolute -right-8 -top-6 opacity-10 dark:opacity-20">
        <Building2 className="w-32 h-32 text-blue-500" />
      </div>

      <div className="relative p-5 md:p-6 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <Link
              href="/client"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/70 dark:bg-slate-800/80 border border-gray-200/70 dark:border-slate-700/80 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-slate-700 transition-colors"
              aria-label="Back to Clients"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-lg md:text-2xl font-bold shadow-md">
                {client.Name.charAt(0)}
              </div>

              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Client Profile
                </p>
                <h1 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white leading-snug">
                  {client.Name}
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] md:text-xs font-medium ${getStatusColor(
                      client.status || "Active"
                    )}`}
                  >
                    {client.status || "Active"}
                  </span>
                  {client.CompleteAddress && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] md:text-xs bg-white/70 dark:bg-slate-800/80 border border-gray-200/60 dark:border-slate-700/80 text-gray-600 dark:text-gray-200">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="line-clamp-1">{client.CompleteAddress}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1 text-sm">
          <div className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
            <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/80 dark:bg-slate-800/80 border border-gray-200/70 dark:border-slate-700/80">
              <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Business Email
              </p>
              <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                {client.Email || "-"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
            <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/80 dark:bg-slate-800/80 border border-gray-200/70 dark:border-slate-700/80">
              <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Primary Phone
              </p>
              <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                {client.Phone || "-"}
              </p>
            </div>
          </div>

          {client.Website && (
            <div className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
              <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/80 dark:bg-slate-800/80 border border-gray-200/70 dark:border-slate-700/80">
                <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Website
                </p>
                <a
                  href={client.Website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 dark:text-blue-400 hover:underline truncate"
                >
                  {client.Website}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ClientInfoCard;


