import { fetchWithAuth } from "@/src/app/services/authservice";
import { withMediaPrefix } from "@/src/utils/publicMedai";
import toast from "react-hot-toast";
import { create } from "zustand";

export type DocumentSortOrder = "ASC" | "DESC";

export interface DocumentsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface DocumentFolderQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: DocumentSortOrder;
  includeEmpty?: boolean;
}

export interface ClientDocumentFolder {
  clientId: number;
  clientName: string;
  orderFoldersCount: number;
  documentsCount: number;
  lastDocumentDate: string | null;
  averageAttachmentProgress: number;
}

export interface OrderDocumentFolder {
  type: "order";
  id: number;
  orderId: number;
  name: string;
  orderNumber: string;
  orderName: string;
  documentsCount: number;
  lastDocumentDate: string | null;
  attachmentProgress: number;
}

export interface OrderDocumentFile {
  id: number;
  mediaId: number;
  fileName: string;
  displayName: string;
  fileType: string | null;
  fileExtension: string | null;
  typeId: number | null;
  typeName: string | null;
  fileSize: number | null;
  uploadedAt: string | null;
  uploadedBy: string | null;
  fileUrl: string | null;
}

export interface ClientDocumentsResponse {
  items: ClientDocumentFolder[];
  pagination: DocumentsPagination;
  sort?: {
    sortBy: string;
    sortOrder: DocumentSortOrder;
  };
  filters?: {
    search: string | null;
    includeEmpty: boolean;
  };
}

export interface OrderFoldersResponse {
  clientId: number;
  clientName: string;
  items: OrderDocumentFolder[];
  folders?: OrderDocumentFolder[];
  pagination: DocumentsPagination;
  sort?: {
    sortBy: string;
    sortOrder: DocumentSortOrder;
  };
  filters?: {
    search: string | null;
    includeEmpty: boolean;
  };
}

export interface OrderDocumentsResponse {
  orderId: number;
  orderNumber: string;
  orderName: string;
  items: OrderDocumentFile[];
  documents?: OrderDocumentFile[];
  pagination: DocumentsPagination;
  sort?: {
    sortBy: string;
    sortOrder: DocumentSortOrder;
  };
  filters?: {
    search: string | null;
  };
}

interface ApiEnvelope<T> {
  data?: T;
  message?: string | string[];
}

interface DocumentsStore {
  rootFolders: ClientDocumentFolder[];
  clientFolder: OrderFoldersResponse | null;
  orderFolder: OrderDocumentsResponse | null;
  rootPagination: DocumentsPagination | null;
  clientPagination: DocumentsPagination | null;
  orderPagination: DocumentsPagination | null;
  loading: boolean;
  error: string | null;
  fetchRootFolders: (query?: DocumentFolderQuery) => Promise<void>;
  fetchClientFolder: (
    clientId: number,
    query?: DocumentFolderQuery
  ) => Promise<void>;
  fetchOrderFolder: (
    orderId: number,
    query?: DocumentFolderQuery
  ) => Promise<void>;
  clearClientFolder: () => void;
  clearOrderFolder: () => void;
}

const emptyPagination: DocumentsPagination = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasMore: false,
};

const getMessage = (payload: ApiEnvelope<unknown> | null, fallback: string) => {
  const message = payload?.message;
  if (Array.isArray(message)) return message.join(" ");
  return message || fallback;
};

const readJson = async <T>(response: Response): Promise<T | null> => {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
};

const unwrapPayload = <T>(result: ApiEnvelope<T> | T | null): T | null => {
  if (!result) return null;
  if (typeof result === "object" && "data" in result) {
    return (result as ApiEnvelope<T>).data ?? null;
  }
  return result as T;
};

const buildQueryString = (query?: DocumentFolderQuery) => {
  const params = new URLSearchParams();

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    params.set(key, String(value));
  });

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
};

const normalizePagination = (
  pagination?: Partial<DocumentsPagination> | null,
  query?: DocumentFolderQuery
): DocumentsPagination => ({
  page: Number(pagination?.page ?? query?.page ?? emptyPagination.page),
  limit: Number(pagination?.limit ?? query?.limit ?? emptyPagination.limit),
  total: Number(pagination?.total ?? emptyPagination.total),
  totalPages: Number(pagination?.totalPages ?? emptyPagination.totalPages),
  hasMore: Boolean(pagination?.hasMore ?? emptyPagination.hasMore),
});

const normalizePercent = (value: unknown) => {
  const percent = Math.round(Number(value ?? 0));
  if (!Number.isFinite(percent)) return 0;
  return Math.min(100, Math.max(0, percent));
};

const normalizeRootFolder = (folder: any): ClientDocumentFolder => ({
  clientId: Number(folder.clientId ?? folder.Id ?? 0),
  clientName: String(folder.clientName ?? folder.Name ?? ""),
  orderFoldersCount: Number(
    folder.orderFoldersCount ??
      folder.folderCount ??
      folder.foldersCount ??
      folder.orderCount ??
      0
  ),
  documentsCount: Number(
    folder.documentsCount ?? folder.fileCount ?? folder.filesCount ?? 0
  ),
  lastDocumentDate:
    folder.lastDocumentDate ?? folder.updatedAt ?? folder.UpdatedOn ?? null,
  averageAttachmentProgress: normalizePercent(
    folder.averageAttachmentProgress ?? folder.attachmentProgress
  ),
});

const normalizeOrderFolder = (folder: any): OrderDocumentFolder => {
  const orderId = Number(folder.orderId ?? folder.id ?? folder.Id ?? 0);
  const orderNumber = String(
    folder.orderNumber ?? folder.OrderNumber ?? folder.name ?? `Order-${orderId}`
  );
  const orderName = String(
    folder.orderName ?? folder.OrderName ?? folder.name ?? orderNumber
  );

  return {
    type: "order",
    id: orderId,
    orderId,
    name: folder.name ?? orderName,
    orderNumber,
    orderName,
    documentsCount: Number(
      folder.documentsCount ?? folder.fileCount ?? folder.filesCount ?? 0
    ),
    lastDocumentDate:
      folder.lastDocumentDate ?? folder.updatedAt ?? folder.UpdatedOn ?? null,
    attachmentProgress: normalizePercent(folder.attachmentProgress),
  };
};

const normalizeOrderFile = (file: any): OrderDocumentFile => {
  const rawFileUrl = file.fileUrl ?? file.file_url ?? file.url ?? file.path;
  const fileUrl = rawFileUrl ? withMediaPrefix(String(rawFileUrl)) : null;
  const fileType = file.fileType ?? file.file_type ?? null;
  const rawFileName = String(file.fileName ?? file.file_name ?? "");
  const displayName = String(
    file.displayName ??
      (rawFileName && fileType && !rawFileName.endsWith(`.${fileType}`)
        ? `${rawFileName}.${fileType}`
        : rawFileName || "Document")
  );

  return {
    id: Number(file.id ?? 0),
    mediaId: Number(file.mediaId ?? file.id ?? 0),
    fileName: rawFileName,
    displayName,
    fileType,
    fileExtension: file.fileExtension ?? fileType,
    typeId:
      file.typeId === undefined || file.typeId === null
        ? null
        : Number(file.typeId),
    typeName: file.typeName ?? file.documentTypeName ?? file.tag ?? null,
    fileSize: file.fileSize ?? null,
    uploadedAt: file.uploadedAt ?? file.uploadedOn ?? file.uploaded_on ?? null,
    uploadedBy: file.uploadedBy ?? file.uploaded_by ?? null,
    fileUrl,
  };
};

export const useDocumentsStore = create<DocumentsStore>((set) => ({
  rootFolders: [],
  clientFolder: null,
  orderFolder: null,
  rootPagination: null,
  clientPagination: null,
  orderPagination: null,
  loading: false,
  error: null,

  fetchRootFolders: async (query) => {
    set({ loading: true, error: null });

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/documents/folders${buildQueryString(
          query
        )}`
      );
      const result = await readJson<ApiEnvelope<ClientDocumentsResponse>>(response);
      const payload = unwrapPayload<ClientDocumentsResponse>(result);

      if (!response.ok || !payload) {
        const message = getMessage(result, "Failed to fetch document folders");
        set({ loading: false, error: message });
        toast.error(message);
        return;
      }

      const items = Array.isArray((payload as any).items)
        ? (payload as any).items
        : Array.isArray((payload as any).data)
        ? (payload as any).data
        : [];

      set({
        rootFolders: items.map(normalizeRootFolder),
        rootPagination: normalizePagination(payload.pagination, query),
        loading: false,
        error: null,
      });
    } catch (error) {
      const message = "Failed to fetch document folders";
      set({ loading: false, error: message });
      toast.error(message);
    }
  },

  fetchClientFolder: async (clientId, query) => {
    set({ loading: true, error: null, orderFolder: null });

    try {
      const response = await fetchWithAuth(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/documents/folders/client/${clientId}${buildQueryString(query)}`
      );
      const result = await readJson<ApiEnvelope<OrderFoldersResponse>>(response);
      const payload = unwrapPayload<OrderFoldersResponse>(result);

      if (!response.ok || !payload) {
        const message = getMessage(result, "Failed to fetch client documents");
        set({ loading: false, error: message });
        toast.error(message);
        return;
      }

      const items = Array.isArray((payload as any).items)
        ? (payload as any).items
        : Array.isArray((payload as any).folders)
        ? (payload as any).folders
        : [];
      const normalizedPayload: OrderFoldersResponse = {
        ...payload,
        items: items.map(normalizeOrderFolder),
        pagination: normalizePagination(payload.pagination, query),
      };

      set({
        clientFolder: normalizedPayload,
        clientPagination: normalizedPayload.pagination,
        loading: false,
        error: null,
      });
    } catch (error) {
      const message = "Failed to fetch client documents";
      set({ loading: false, error: message });
      toast.error(message);
    }
  },

  fetchOrderFolder: async (orderId, query) => {
    set({ loading: true, error: null });

    try {
      const response = await fetchWithAuth(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/documents/folders/order/${orderId}${buildQueryString(query)}`
      );
      const result = await readJson<ApiEnvelope<OrderDocumentsResponse>>(response);
      const payload = unwrapPayload<OrderDocumentsResponse>(result);

      if (!response.ok || !payload) {
        const message = getMessage(result, "Failed to fetch order documents");
        set({ loading: false, error: message });
        toast.error(message);
        return;
      }

      const items = Array.isArray((payload as any).items)
        ? (payload as any).items
        : Array.isArray((payload as any).documents)
        ? (payload as any).documents
        : [];
      const normalizedPayload: OrderDocumentsResponse = {
        ...payload,
        items: items.map(normalizeOrderFile),
        documents: items.map(normalizeOrderFile),
        pagination: normalizePagination(payload.pagination, query),
      };

      set({
        orderFolder: normalizedPayload,
        orderPagination: normalizedPayload.pagination,
        loading: false,
        error: null,
      });
    } catch (error) {
      const message = "Failed to fetch order documents";
      set({ loading: false, error: message });
      toast.error(message);
    }
  },

  clearClientFolder: () =>
    set({ clientFolder: null, clientPagination: null, orderFolder: null }),
  clearOrderFolder: () => set({ orderFolder: null, orderPagination: null }),
}));

export default useDocumentsStore;
