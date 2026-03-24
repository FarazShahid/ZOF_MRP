"use client";

import Link from "next/link";
import { useTheme } from "./context/ThemeContext";

export default function NotFound() {
  const { theme } = useTheme();

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="relative w-full max-w-lg text-center">
        {/* Ambient glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Card */}
        <div className="relative rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-10 shadow-lg dark:border-[#1d2939] dark:from-white/[0.05] dark:to-transparent dark:shadow-none">
          {/* 404 number */}
          <h1 className="text-[120px] font-bold leading-none tracking-tight bg-gradient-to-br from-brand-500 to-brand-700 bg-clip-text text-transparent select-none">
            404
          </h1>

          {/* Divider */}
          <div className="mx-auto my-6 h-px w-24 bg-gradient-to-r from-transparent via-brand-500 to-transparent" />

          {/* Message */}
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Page Not Found
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
            The page you are looking for doesn&apos;t exist or has been moved.
            Please check the URL or go back to the dashboard.
          </p>

          {/* Actions */}
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-brand-600 hover:shadow-md active:scale-[0.98]"
            >
              <i className="ri-home-4-line text-base" />
              Go to Dashboard
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:shadow-sm active:scale-[0.98] dark:border-[#1d2939] dark:bg-white/[0.05] dark:text-gray-300 dark:hover:bg-white/[0.08]"
            >
              <i className="ri-arrow-left-line text-base" />
              Go Back
            </button>
          </div>
        </div>

        {/* Bottom hint */}
        <p className="mt-6 text-xs text-gray-400 dark:text-gray-500">
          Error code: 404 &middot; Seals Forge
        </p>
      </div>
    </div>
  );
}
