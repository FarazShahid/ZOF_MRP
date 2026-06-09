"use client";

import React from "react";

import AdminDashboardLayout from "@/src/app/components/common/AdminDashboardLayout";
import PermissionGuard from "@/src/app/components/auth/PermissionGaurd";
import DocumentsFolderView from "@/src/app/components/documents/DocumentsFolderView";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";

const DocumentsPage = () => {
  return (
    <AdminDashboardLayout>
      <PermissionGuard required={PERMISSIONS_ENUM.ORDER.VIEW}>
        <div className="mx-auto max-w-7xl space-y-5">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Documents
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Client and order folders
            </p>
          </div>

          <DocumentsFolderView includeEmpty />
        </div>
      </PermissionGuard>
    </AdminDashboardLayout>
  );
};

export default DocumentsPage;
