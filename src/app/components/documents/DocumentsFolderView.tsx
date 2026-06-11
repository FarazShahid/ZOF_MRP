"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import {
  ArrowDownAZ,
  ArrowUpAZ,
  ChevronRight,
  Download,
  ExternalLink,
  FileArchive,
  FileText,
  Folder,
  FolderOpen,
  Home,
  ListFilter,
  Plus,
  RefreshCcw,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";

import { fetchWithAuth } from "@/src/app/services/authservice";
import { withMediaPrefix } from "@/src/utils/publicMedai";
import { useDocumentCenterStore } from "@/store/useDocumentCenterStore";
import useDocumentsStore, {
  ClientDocumentFolder,
  DocumentsPagination,
  DocumentSortOrder,
  OrderDocumentFile,
  OrderDocumentFolder,
} from "@/store/useDocumentsStore";
import useOrderDocumentTypesStore from "@/store/useOrderDocumentTypesStore";
import type { UploadedFile } from "@/store/useFileUploadStore";
import OrderDocumentUploadPicker, {
  getOrderDocumentUploadItems,
  getOrderDocumentValidationError,
  type OrderDocumentFilesByType,
} from "@/src/app/orders/components/OrderDocumentUploadPicker";

type FolderScope = "root" | "client" | "order";

type DocumentsFolderViewProps = {
  clientId?: number;
  clientName?: string;
  includeEmpty?: boolean;
};

const scopeDefaults: Record<
  FolderScope,
  { sortBy: string; sortOrder: DocumentSortOrder }
> = {
  root: { sortBy: "clientName", sortOrder: "ASC" },
  client: { sortBy: "orderNumber", sortOrder: "ASC" },
  order: { sortBy: "uploadedAt", sortOrder: "DESC" },
};

const sortOptions: Record<FolderScope, { label: string; value: string }[]> = {
  root: [
    { label: "Name", value: "clientName" },
    { label: "Folders", value: "folderCount" },
    { label: "Modified", value: "lastDocumentDate" },
  ],
  client: [
    { label: "Name", value: "orderNumber" },
    { label: "Files", value: "documentsCount" },
  ],
  order: [
    { label: "Name", value: "fileName" },
    { label: "Extension", value: "fileType" },
    { label: "Uploaded Date", value: "uploadedAt" },
  ],
};

const pageSizeOptions = [24, 48, 96];

const getPaginationLabel = (pagination: DocumentsPagination | null) => {
  if (!pagination || pagination.total === 0) return "0 items";

  const start = (pagination.page - 1) * pagination.limit + 1;
  const end = Math.min(pagination.page * pagination.limit, pagination.total);
  return `${start}-${end} of ${pagination.total} items`;
};

const getDownloadFileName = (file: OrderDocumentFile) => {
  const fileName = file.displayName || file.fileName || "document";
  const extension = (file.fileExtension || file.fileType || "")
    .replace(/^\./, "")
    .trim();

  if (
    !extension ||
    fileName.toLowerCase().endsWith(`.${extension.toLowerCase()}`)
  ) {
    return fileName;
  }

  return `${fileName}.${extension}`;
};

const shouldUseAuthenticatedDownload = (fileUrl: string) => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiBaseUrl) return false;

  try {
    const targetUrl = new URL(fileUrl, window.location.origin);
    const apiUrl = new URL(apiBaseUrl, window.location.origin);
    return targetUrl.origin === apiUrl.origin;
  } catch {
    return false;
  }
};

const fetchDownloadResponse = (fileUrl: string) => {
  const downloadUrl = withMediaPrefix(fileUrl);

  if (shouldUseAuthenticatedDownload(downloadUrl)) {
    return fetchWithAuth(downloadUrl);
  }

  return fetch(downloadUrl);
};

const downloadDocumentFile = async (file: OrderDocumentFile) => {
  if (!file.fileUrl) {
    toast.error("File URL is not available.");
    return;
  }

  try {
    const response = await fetchDownloadResponse(file.fileUrl);

    if (!response.ok) {
      throw new Error(`Download failed with status ${response.status}`);
    }

    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = objectUrl;
    link.download = getDownloadFileName(file);
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.setTimeout(() => {
      window.URL.revokeObjectURL(objectUrl);
    }, 1000);
  } catch (error) {
    console.error("Document download failed", error);
    toast.error("Failed to download file.");
  }
};

const DocumentsFolderView: React.FC<DocumentsFolderViewProps> = ({
  clientId,
  clientName,
}) => {
  const isClientScoped = typeof clientId === "number" && clientId > 0;
  const {
    rootFolders,
    clientFolder,
    orderFolder,
    rootPagination,
    clientPagination,
    orderPagination,
    loading,
    error,
    fetchRootFolders,
    fetchClientFolder,
    fetchOrderFolder,
    clearClientFolder,
    clearOrderFolder,
  } = useDocumentsStore();

  const [selectedClient, setSelectedClient] = useState<{
    clientId: number;
    clientName: string;
  } | null>(
    isClientScoped
      ? {
          clientId,
          clientName: clientName || `Client ${clientId}`,
        }
      : null
  );
  const [selectedOrder, setSelectedOrder] = useState<{
    orderId: number;
    orderNumber: string;
    orderName: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(24);
  const [sortBy, setSortBy] = useState(scopeDefaults.root.sortBy);
  const [sortOrder, setSortOrder] = useState<DocumentSortOrder>(
    scopeDefaults.root.sortOrder
  );
  const [expandedRoot, setExpandedRoot] = useState(true);
  const [expandedClientIds, setExpandedClientIds] = useState<Set<number>>(
    () => new Set(isClientScoped && clientId ? [clientId] : [])
  );
  const [documentFiles, setDocumentFiles] = useState<OrderDocumentFilesByType>(
    {}
  );
  const [selectedDocumentTypeIds, setSelectedDocumentTypeIds] = useState<
    number[]
  >([]);
  const [uploadPickerResetKey, setUploadPickerResetKey] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [showUploadPanel, setShowUploadPanel] = useState(false);

  const { uploadOrderDocuments, loadingDoc } = useDocumentCenterStore();
  const { orderDocumentTypes, fetchOrderDocumentTypes } =
    useOrderDocumentTypesStore();

  const scope: FolderScope = selectedOrder
    ? "order"
    : selectedClient
    ? "client"
    : "root";

  const clientItems = clientFolder?.items ?? [];
  const orderItems = orderFolder?.items ?? [];

  useEffect(() => {
    if (isClientScoped) {
      setSelectedClient({
        clientId,
        clientName: clientName || `Client ${clientId}`,
      });
      setSelectedOrder(null);
      setExpandedClientIds(new Set([clientId]));
      return;
    }

    setSelectedClient(null);
    setSelectedOrder(null);
  }, [clientId, clientName, isClientScoped]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const defaults = scopeDefaults[scope];
    setPage(1);
    setSortBy(defaults.sortBy);
    setSortOrder(defaults.sortOrder);
    setSearchTerm("");
    setDebouncedSearch("");
  }, [scope]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, limit, sortBy, sortOrder]);

  useEffect(() => {
    const query = {
      page,
      limit,
      search: debouncedSearch || undefined,
      sortBy,
      sortOrder,
    };

    if (selectedOrder) {
      fetchOrderFolder(selectedOrder.orderId, query);
      return;
    }

    if (selectedClient) {
      fetchClientFolder(selectedClient.clientId, query);
      return;
    }

    fetchRootFolders(query);
  }, [
    debouncedSearch,
    fetchClientFolder,
    fetchOrderFolder,
    fetchRootFolders,
    limit,
    page,
    selectedClient,
    selectedOrder,
    sortBy,
    sortOrder,
  ]);

  const activePagination = useMemo(() => {
    if (scope === "order") return orderPagination;
    if (scope === "client") return clientPagination;
    return rootPagination;
  }, [clientPagination, orderPagination, rootPagination, scope]);

  const explorerTitle = selectedOrder
    ? selectedOrder.orderName
    : isClientScoped
    ? "Documents"
    : selectedClient
    ? selectedClient.clientName
    : "Documents";

  const handleBackToClients = () => {
    if (isClientScoped) return;
    setSelectedClient(null);
    setSelectedOrder(null);
    clearClientFolder();
    clearOrderFolder();
  };

  const handleBackToOrders = () => {
    setSelectedOrder(null);
    clearOrderFolder();
  };

  const openClientFolder = (folder: ClientDocumentFolder) => {
    setSelectedClient({
      clientId: folder.clientId,
      clientName: folder.clientName,
    });
    setSelectedOrder(null);
    setExpandedClientIds((current) => {
      const next = new Set(current);
      next.add(folder.clientId);
      return next;
    });
  };

  const openOrderFolder = (folder: OrderDocumentFolder) => {
    if (selectedClient) {
      setExpandedClientIds((current) => {
        const next = new Set(current);
        next.add(selectedClient.clientId);
        return next;
      });
    }

    setSelectedOrder({
      orderId: folder.orderId,
      orderNumber: folder.orderNumber,
      orderName: folder.orderName,
    });
  };

  const toggleClientBranch = (folder: ClientDocumentFolder) => {
    const isExpanded = expandedClientIds.has(folder.clientId);

    if (isExpanded) {
      setExpandedClientIds((current) => {
        const next = new Set(current);
        next.delete(folder.clientId);
        return next;
      });
      return;
    }

    openClientFolder(folder);
  };

  const handleRefresh = () => {
    const query = {
      page,
      limit,
      search: debouncedSearch || undefined,
      sortBy,
      sortOrder,
    };

    if (selectedOrder) {
      fetchOrderFolder(selectedOrder.orderId, query);
    } else if (selectedClient) {
      fetchClientFolder(selectedClient.clientId, query);
    } else {
      fetchRootFolders(query);
    }
  };

  const handleOrderDocumentFilesChange = useCallback(
    (typeId: number, files: UploadedFile[]) => {
      setDocumentFiles((prev) => {
        const next = { ...prev };

        if (files.length === 0) {
          delete next[typeId];
        } else {
          next[typeId] = files;
        }

        return next;
      });
    },
    []
  );

  const handleRemoveOrderDocumentFile = useCallback(
    (typeId: number, fileIndex: number) => {
      setDocumentFiles((prev) => {
        const currentFiles = prev[typeId] ?? [];
        const nextFiles = currentFiles.filter((_, index) => index !== fileIndex);
        const next = { ...prev };

        if (nextFiles.length === 0) {
          delete next[typeId];
        } else {
          next[typeId] = nextFiles;
        }

        return next;
      });
    },
    []
  );

  const resetUploadPicker = useCallback(() => {
    setDocumentFiles({});
    setSelectedDocumentTypeIds([]);
    setUploadPickerResetKey((prev) => prev + 1);
  }, []);

  const handleCloseUploadPanel = () => {
    if (uploading || loadingDoc) return;

    resetUploadPicker();
    setShowUploadPanel(false);
  };

  const handleUploadDocuments = async () => {
    if (!selectedOrder) {
      toast.error("Open an order folder before uploading documents.");
      return;
    }

    if (selectedDocumentTypeIds.length === 0) {
      toast.error("Select a document type before uploading.");
      return;
    }

    const availableDocumentTypes =
      orderDocumentTypes.length > 0
        ? orderDocumentTypes
        : await fetchOrderDocumentTypes();
    const documentTypesError = useOrderDocumentTypesStore.getState().error;

    if (documentTypesError && availableDocumentTypes.length === 0) {
      toast.error("Order document types could not be loaded. Please try again.");
      return;
    }

    const documentValidationError = getOrderDocumentValidationError(
      availableDocumentTypes,
      documentFiles,
      selectedDocumentTypeIds
    );

    if (documentValidationError) {
      toast.error(documentValidationError);
      return;
    }

    const documentsToUpload = getOrderDocumentUploadItems(
      availableDocumentTypes,
      documentFiles
    );

    if (documentsToUpload.length === 0) {
      toast.error("Add at least one file before uploading.");
      return;
    }

    setUploading(true);
    try {
      const uploaded = await uploadOrderDocuments(
        selectedOrder.orderId,
        documentsToUpload
      );

      if (!uploaded) return;

      resetUploadPicker();
      setShowUploadPanel(false);
      await fetchOrderFolder(selectedOrder.orderId, {
        page,
        limit,
        search: debouncedSearch || undefined,
        sortBy,
        sortOrder,
      });
    } finally {
      setUploading(false);
    }
  };

  const renderBreadcrumb = () => (
    <div className="flex min-h-8 min-w-0 max-w-full flex-nowrap items-center gap-1 overflow-x-auto whitespace-nowrap text-sm">
      {isClientScoped && (
        <button
          type="button"
          onClick={handleBackToOrders}
          className={`inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 font-medium ${
            selectedOrder
              ? "text-gray-600 hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-slate-800 dark:hover:text-blue-300"
              : "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200"
          }`}
        >
          <Home className="h-4 w-4" />
          Documents
        </button>
      )}

      {!isClientScoped && (
        <button
          type="button"
          onClick={handleBackToClients}
          className={`inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 font-medium ${
            selectedClient
              ? "text-gray-600 hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-slate-800 dark:hover:text-blue-300"
              : "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200"
          }`}
        >
          <Home className="h-4 w-4" />
          Documents
        </button>
      )}

      {!isClientScoped && selectedClient && (
        <>
          <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
          <button
            type="button"
            onClick={handleBackToOrders}
            className={`max-w-[240px] shrink-0 truncate rounded-md px-2 py-1 font-medium ${
              selectedOrder
                ? "text-gray-600 hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-slate-800 dark:hover:text-blue-300"
                : "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200"
            }`}
          >
            {selectedClient.clientName}
          </button>
        </>
      )}

      {selectedOrder && (
        <>
          <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
          <span className="max-w-[260px] shrink-0 truncate rounded-md bg-blue-50 px-2 py-1 font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
            {selectedOrder.orderNumber}
          </span>
        </>
      )}
    </div>
  );

  const renderExplorerTree = () => (
    <aside className="flex w-full shrink-0 flex-col border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-slate-950 lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex min-h-0 flex-1 flex-col p-3">
        <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Folders
        </p>

        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          {isClientScoped ? (
            <div className="space-y-1">
              {clientItems.length ? (
                clientItems.map((folder) => (
                  <TreeItem
                    key={folder.orderId}
                    active={selectedOrder?.orderId === folder.orderId}
                    icon={
                      selectedOrder?.orderId === folder.orderId ? (
                        <FolderOpen className="h-4 w-4 text-amber-600" />
                      ) : (
                        <Folder className="h-4 w-4 text-amber-600" />
                      )
                    }
                    label={folder.orderNumber}
                    level={0}
                    onClick={() => openOrderFolder(folder)}
                    open={selectedOrder?.orderId === folder.orderId}
                  />
                ))
              ) : (
                <p className="px-2 py-3 text-sm text-gray-500 dark:text-gray-400">
                  No folders loaded
                </p>
              )}
            </div>
          ) : (
            <>
              <TreeItem
                active={scope === "root"}
                hasChildren={rootFolders.length > 0}
                icon={<Home className="h-4 w-4" />}
                label="Documents"
                level={0}
                onClick={handleBackToClients}
                onToggle={() => setExpandedRoot((current) => !current)}
                open={expandedRoot}
              />

              <div className="mt-1 space-y-1">
                {expandedRoot && rootFolders.length ? (
                  rootFolders.map((folder) => {
                    const isOpenClient =
                      selectedClient?.clientId === folder.clientId;
                    const isExpanded = expandedClientIds.has(folder.clientId);

                    return (
                      <React.Fragment key={folder.clientId}>
                        <TreeItem
                          active={isOpenClient && !selectedOrder}
                          hasChildren={isOpenClient && clientItems.length > 0}
                          icon={
                            isExpanded ? (
                              <FolderOpen className="h-4 w-4 text-amber-600" />
                            ) : (
                              <Folder className="h-4 w-4 text-amber-600" />
                            )
                          }
                          label={folder.clientName}
                          level={1}
                          onClick={() => openClientFolder(folder)}
                          onToggle={() => toggleClientBranch(folder)}
                          open={isExpanded}
                        />

                        {isOpenClient &&
                          isExpanded &&
                          clientItems.map((orderFolder) => (
                            <TreeItem
                              key={orderFolder.orderId}
                              active={
                                selectedOrder?.orderId === orderFolder.orderId
                              }
                              icon={
                                selectedOrder?.orderId ===
                                orderFolder.orderId ? (
                                  <FolderOpen className="h-4 w-4 text-amber-600" />
                                ) : (
                                  <Folder className="h-4 w-4 text-amber-600" />
                                )
                              }
                              label={orderFolder.orderNumber}
                              level={2}
                              onClick={() => openOrderFolder(orderFolder)}
                              open={
                                selectedOrder?.orderId === orderFolder.orderId
                              }
                            />
                          ))}
                      </React.Fragment>
                    );
                  })
                ) : expandedRoot ? (
                  <p className="px-2 py-3 text-sm text-gray-500 dark:text-gray-400">
                    No folders loaded
                  </p>
                ) : null}
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );

  const renderToolbar = () => (
    <div className="border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-slate-900">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          {renderBreadcrumb()}
        </div>

        <div className="flex w-full flex-col gap-3 xl:w-auto">
          <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-[minmax(220px,1fr)_150px_44px_120px_44px] xl:w-[720px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={
                  scope === "order"
                    ? "Search files"
                    : scope === "client"
                    ? "Search orders"
                    : "Search clients"
                }
                className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div className="relative">
              <ListFilter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="h-10 w-full appearance-none rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-slate-900 dark:text-white"
              >
                {sortOptions[scope].map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <IconButton
              title={sortOrder === "ASC" ? "Ascending" : "Descending"}
              onClick={() =>
                setSortOrder((current) =>
                  current === "ASC" ? "DESC" : "ASC"
                )
              }
            >
              {sortOrder === "ASC" ? (
                <ArrowDownAZ className="h-4 w-4" />
              ) : (
                <ArrowUpAZ className="h-4 w-4" />
              )}
            </IconButton>

            <select
              value={limit}
              onChange={(event) => setLimit(Number(event.target.value))}
              className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-slate-900 dark:text-white"
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option} / page
                </option>
              ))}
            </select>

            <IconButton title="Refresh" onClick={handleRefresh}>
              <RefreshCcw className="h-4 w-4" />
            </IconButton>
          </div>

          {scope === "order" && selectedOrder && (
            <div className="flex justify-start xl:justify-end">
              <Button
                color="primary"
                startContent={<Plus className="h-4 w-4" />}
                onPress={() => setShowUploadPanel(true)}
                isDisabled={uploading || loadingDoc}
                className="w-full sm:w-auto"
              >
                Add Order Documents
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderTiles = () => {
    if (loading) return <LoadingState />;

    if (error) {
      return (
        <div className="p-6">
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-8 text-center text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        </div>
      );
    }

    if (scope === "root") {
      if (!rootFolders.length) {
        return <EmptyState label="No client folders found." />;
      }

      return (
        <LargeTileGrid>
          {rootFolders.map((folder) => (
            <ClientFolderTile
              key={folder.clientId}
              folder={folder}
              onOpen={() => openClientFolder(folder)}
            />
          ))}
        </LargeTileGrid>
      );
    }

    if (scope === "client") {
      if (!clientItems.length) {
        return <EmptyState label="No order folders found." />;
      }

      return (
        <LargeTileGrid>
          {clientItems.map((folder) => (
            <OrderFolderTile
              key={folder.orderId}
              folder={folder}
              onOpen={() => openOrderFolder(folder)}
            />
          ))}
        </LargeTileGrid>
      );
    }

    if (!orderItems.length) {
      return <EmptyState label="No files found in this order folder." />;
    }

    return (
      <LargeTileGrid>
        {orderItems.map((file) => (
          <FileTile key={`${file.id}-${file.mediaId}`} file={file} />
        ))}
      </LargeTileGrid>
    );
  };

  return (
    <>
      <div className="overflow-hidden border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-slate-900">
        {renderToolbar()}

        <div className="flex min-h-[520px] flex-col lg:flex-row">
          {renderExplorerTree()}

          <main className="min-w-0 flex-1 bg-white dark:bg-slate-900">
            {renderTiles()}
          </main>
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600 dark:border-gray-700 dark:bg-slate-950 dark:text-gray-300 sm:flex-row sm:items-center sm:justify-between">
          <span>{getPaginationLabel(activePagination)}</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={
                !activePagination || activePagination.page <= 1 || loading
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-slate-900 dark:text-gray-200 dark:hover:bg-slate-800"
            >
              Previous
            </button>
            <span className="min-w-[88px] text-center">
              Page {activePagination?.page ?? 1} of{" "}
              {activePagination?.totalPages || 1}
            </span>
            <button
              type="button"
              onClick={() => setPage((current) => current + 1)}
              disabled={!activePagination?.hasMore || loading}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-slate-900 dark:text-gray-200 dark:hover:bg-slate-800"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showUploadPanel}
        size="5xl"
        scrollBehavior="inside"
        onOpenChange={handleCloseUploadPanel}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add Order Documents
                <span className="text-xs font-normal text-gray-500 dark:text-slate-400">
                  Select a document type and upload files matching its supported
                  extensions.
                </span>
              </ModalHeader>
              <ModalBody>
                <OrderDocumentUploadPicker
                  documentFiles={documentFiles}
                  onDocumentFilesChange={handleOrderDocumentFilesChange}
                  onRemoveDocumentFile={handleRemoveOrderDocumentFile}
                  onSelectedDocumentTypesChange={setSelectedDocumentTypeIds}
                  disabled={loadingDoc || uploading || !selectedOrder}
                  resetKey={uploadPickerResetKey}
                  className="flex w-full max-w-full flex-col gap-5"
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="flat"
                  onPress={handleCloseUploadPanel}
                  isDisabled={uploading || loadingDoc}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleUploadDocuments}
                  isLoading={uploading}
                  isDisabled={loadingDoc || !selectedOrder}
                >
                  Upload Documents
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

type IconButtonProps = {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
};

const IconButton: React.FC<IconButtonProps> = ({ title, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-slate-900 dark:text-gray-200 dark:hover:bg-slate-800"
  >
    {children}
  </button>
);

type TreeItemProps = {
  active?: boolean;
  disabled?: boolean;
  hasChildren?: boolean;
  icon: React.ReactNode;
  label: string;
  level: number;
  onClick: () => void;
  onToggle?: () => void;
  open?: boolean;
};

const TreeItem: React.FC<TreeItemProps> = ({
  active = false,
  disabled = false,
  hasChildren = false,
  icon,
  label,
  level,
  onClick,
  onToggle,
  open = false,
}) => {
  const showChevron = hasChildren || onToggle;

  return (
    <div
      className={`flex h-9 w-full items-center rounded-md pr-2 text-sm transition ${
        active
          ? "bg-white font-semibold text-blue-700 shadow-sm dark:bg-slate-900 dark:text-blue-200"
          : "text-gray-700 hover:bg-white dark:text-gray-200 dark:hover:bg-slate-900"
      } ${disabled ? "opacity-90" : ""}`}
      style={{ paddingLeft: `${8 + level * 18}px` }}
      title={label}
    >
      <button
        type="button"
        onClick={onToggle ?? onClick}
        disabled={!showChevron || disabled}
        className={`flex h-7 w-5 shrink-0 items-center justify-center rounded text-gray-400 ${
          showChevron && !disabled ? "hover:bg-gray-100 dark:hover:bg-slate-800" : ""
        }`}
      >
        <ChevronRight
          className={`h-3.5 w-3.5 transition ${open ? "rotate-90" : ""} ${
            showChevron ? "opacity-100" : "opacity-0"
          }`}
        />
      </button>

      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`flex min-w-0 flex-1 items-center gap-1.5 text-left ${
          disabled ? "cursor-default" : ""
        }`}
      >
        <span className="shrink-0">{icon}</span>
        <span className="truncate">{label}</span>
      </button>
    </div>
  );
};

const LargeTileGrid: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="grid grid-cols-[repeat(auto-fill,minmax(156px,156px))] justify-start gap-2 p-3 sm:grid-cols-[repeat(auto-fill,minmax(180px,180px))] sm:gap-3 sm:p-4">
    {children}
  </div>
);

const TileLabel: React.FC<{ name: string; detail?: string }> = ({
  name,
  detail,
}) => (
  <div className="mt-2 min-h-[42px] text-center">
    <p className="mx-auto max-h-10 max-w-[132px] overflow-hidden break-words text-sm font-medium leading-5 text-gray-900 dark:text-white">
      {name}
    </p>
    {detail && (
      <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
        {detail}
      </p>
    )}
  </div>
);

const ClientFolderTile: React.FC<{
  folder: ClientDocumentFolder;
  onOpen: () => void;
}> = ({ folder, onOpen }) => (
  <button
    type="button"
    onClick={onOpen}
    onDoubleClick={onOpen}
    className="group flex aspect-square h-[156px] w-[156px] flex-col items-center justify-center rounded-md border border-transparent bg-transparent p-5 text-center transition hover:border-blue-300 hover:bg-blue-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:hover:border-blue-800 dark:hover:bg-blue-950/30 sm:h-[180px] sm:w-[180px] sm:p-7"
  >
    <Folder className="h-16 w-16 text-amber-500 transition group-hover:text-amber-600 sm:h-20 sm:w-20" />
    <TileLabel
      name={folder.clientName}
      detail={`${folder.orderFoldersCount} folders`}
    />
  </button>
);

const OrderFolderTile: React.FC<{
  folder: OrderDocumentFolder;
  onOpen: () => void;
}> = ({ folder, onOpen }) => (
  <button
    type="button"
    onClick={onOpen}
    onDoubleClick={onOpen}
    className="group flex aspect-square h-[156px] w-[156px] flex-col items-center justify-center rounded-md border border-transparent bg-transparent p-5 text-center transition hover:border-blue-300 hover:bg-blue-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:hover:border-blue-800 dark:hover:bg-blue-950/30 sm:h-[180px] sm:w-[180px] sm:p-7"
  >
    <FolderOpen className="h-16 w-16 text-amber-500 transition group-hover:text-amber-600 sm:h-20 sm:w-20" />
    <TileLabel name={folder.orderName} detail={`${folder.documentsCount} files`} />
  </button>
);

const FileTile: React.FC<{ file: OrderDocumentFile }> = ({ file }) => {
  const isArchive = file.fileExtension?.toLowerCase() === "zip";
  const Icon = isArchive ? FileArchive : FileText;
  const fileUrl = file.fileUrl ? withMediaPrefix(file.fileUrl) : null;

  return (
    <article className="group flex aspect-square h-[156px] w-[156px] flex-col items-center justify-center rounded-md border border-transparent bg-transparent p-5 text-center transition hover:border-blue-300 hover:bg-blue-50 hover:shadow-md focus-within:border-blue-300 focus-within:bg-blue-50 dark:hover:border-blue-800 dark:hover:bg-blue-950/30 dark:focus-within:border-blue-800 dark:focus-within:bg-blue-950/30 sm:h-[180px] sm:w-[180px] sm:p-7">
      <div className="relative flex h-20 w-20 items-center justify-center sm:h-24 sm:w-24">
        <Icon className="h-16 w-16 text-blue-600 transition duration-200 group-hover:scale-105 group-hover:blur-[1.5px] group-hover:opacity-35 group-hover:text-blue-700 group-focus-within:scale-105 group-focus-within:blur-[1.5px] group-focus-within:opacity-35 group-focus-within:text-blue-700 dark:text-blue-300 dark:group-hover:text-blue-200 dark:group-focus-within:text-blue-200 sm:h-20 sm:w-20" />
        <div className="pointer-events-none absolute inset-x-0 top-[50px] z-10 flex justify-center opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100 sm:top-[62px]">
          {fileUrl ? (
            <div className="flex items-center justify-center gap-2">
              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                title="View"
                className="relative z-20 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-blue-700 shadow-lg shadow-blue-900/20 ring-1 ring-blue-200 transition hover:bg-blue-50 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:bg-slate-900 dark:text-blue-300 dark:ring-blue-700 dark:hover:bg-blue-950"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
              <button
                type="button"
                title="Download"
                onClick={() => downloadDocumentFile(file)}
                className="relative z-20 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-900/20 ring-1 ring-white/40 transition hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:bg-blue-500 dark:hover:bg-blue-400"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <span className="rounded-full bg-white/90 px-2 py-1 text-xs text-gray-500 shadow-sm dark:bg-slate-900/90 dark:text-gray-300">
              No URL
            </span>
          )}
        </div>
      </div>
      <div className="transition duration-200 group-hover:blur-[1px] group-hover:opacity-60 group-focus-within:blur-[1px] group-focus-within:opacity-60">
        <TileLabel
          name={file.displayName}
          detail={file.typeName || file.fileExtension || undefined}
        />
      </div>
    </article>
  );
};

const LoadingState = () => (
  <div className="flex min-h-[360px] items-center justify-center">
    <div className="text-center">
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600" />
      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
        Loading documents...
      </p>
    </div>
  </div>
);

const EmptyState: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex min-h-[360px] items-center justify-center">
    <div className="text-center">
      <Folder className="mx-auto h-16 w-16 text-gray-400" />
      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  </div>
);

export default DocumentsFolderView;
