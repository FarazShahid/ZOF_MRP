"use client";

import React, { useEffect, useMemo, useState } from "react";
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
  RefreshCcw,
  Search,
} from "lucide-react";

import useDocumentsStore, {
  ClientDocumentFolder,
  DocumentsPagination,
  DocumentSortOrder,
  OrderDocumentFile,
  OrderDocumentFolder,
} from "@/store/useDocumentsStore";

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

  const renderBreadcrumb = () => (
    <div className="flex min-w-0 flex-wrap items-center gap-1 text-sm">
      {!isClientScoped && (
        <button
          type="button"
          onClick={handleBackToClients}
          className={`inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium ${
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
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <button
            type="button"
            onClick={handleBackToOrders}
            className={`max-w-[240px] truncate rounded-md px-2 py-1 font-medium ${
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
          {!isClientScoped && <ChevronRight className="h-4 w-4 text-gray-400" />}
          <span className="max-w-[260px] truncate rounded-md bg-blue-50 px-2 py-1 font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
            {selectedOrder.orderNumber}
          </span>
        </>
      )}
    </div>
  );

  const renderExplorerTree = () => (
    <aside className="w-full shrink-0 border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-slate-950 lg:w-72 lg:border-b-0 lg:border-r">
      <div className="h-full p-3">
        <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Folders
        </p>

        <div className="max-h-[460px] overflow-y-auto pr-1">
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
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          {renderBreadcrumb()}
          <h2 className="mt-2 truncate text-xl font-semibold text-gray-900 dark:text-white">
            {explorerTitle}
          </h2>
        </div>

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
              setSortOrder((current) => (current === "ASC" ? "DESC" : "ASC"))
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
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-slate-900">
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
            disabled={!activePagination || activePagination.page <= 1 || loading}
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
  <div className="grid grid-cols-2 gap-x-4 gap-y-6 p-5 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
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
    className="group flex min-h-[156px] flex-col items-center justify-start rounded-lg border border-transparent p-3 text-center transition hover:border-blue-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:hover:border-blue-900 dark:hover:bg-blue-950/20"
  >
    <Folder className="h-20 w-20 text-amber-500 transition group-hover:text-amber-600" />
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
    className="group flex min-h-[156px] flex-col items-center justify-start rounded-lg border border-transparent p-3 text-center transition hover:border-blue-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:hover:border-blue-900 dark:hover:bg-blue-950/20"
  >
    <FolderOpen className="h-20 w-20 text-amber-500 transition group-hover:text-amber-600" />
    <TileLabel name={folder.orderName} detail={`${folder.documentsCount} files`} />
  </button>
);

const FileTile: React.FC<{ file: OrderDocumentFile }> = ({ file }) => {
  const isArchive = file.fileExtension?.toLowerCase() === "zip";
  const Icon = isArchive ? FileArchive : FileText;

  return (
    <article className="group flex min-h-[174px] flex-col items-center justify-start rounded-lg border border-transparent p-3 text-center transition hover:border-blue-200 hover:bg-blue-50 dark:hover:border-blue-900 dark:hover:bg-blue-950/20">
      <Icon className="h-20 w-20 text-blue-600 transition group-hover:text-blue-700 dark:text-blue-300" />
      <TileLabel
        name={file.displayName}
        detail={file.typeName || file.fileExtension || undefined}
      />
      <div className="mt-auto flex justify-center gap-1 pt-2">
        {file.fileUrl ? (
          <>
            <a
              href={file.fileUrl}
              target="_blank"
              rel="noreferrer"
              title="View"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-600 hover:bg-white hover:text-blue-700 dark:text-gray-300 dark:hover:bg-slate-900 dark:hover:text-blue-300"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
            <a
              href={file.fileUrl}
              download
              title="Download"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-600 hover:bg-white hover:text-blue-700 dark:text-gray-300 dark:hover:bg-slate-900 dark:hover:text-blue-300"
            >
              <Download className="h-4 w-4" />
            </a>
          </>
        ) : (
          <span className="text-xs text-gray-400">No file URL</span>
        )}
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
