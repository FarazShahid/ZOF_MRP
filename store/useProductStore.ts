import { fetchWithAuth } from "@/src/app/services/authservice";
import toast from "react-hot-toast";
import { create } from "zustand";
import {
  GetPrintingOptionsResponse,
  PrintingOptionType,
} from "./usePrintingOptionsStore";

interface ProductColorMap {
  [productId: number]: ProductAvailableColors[];
}

interface GetProductsResponse {
  data: Product[];
  message: string;
}

interface GetAvailablSizesResponse {
  data: AvailableSizes[];
  message: string;
}

interface AvailableSizes {
  Id: number;
  SizeId: number;
  SizeName: string;
}

export interface Product {
  Id: number;
  Name: string;
  ClientId: number;
  ClientName: string;
  ProjectId?: number;
  ProjectName?: string;
  ProductCategoryId: number;
  ProductCategoryName: string;
  FabricTypeId: number;
  FabricType: string;
  FabricName: string;
  GSM: number;
  isArchived: boolean;
  productStatus: string;
  Description: string;
  CreatedBy: string;
  CreatedOn: string;
  UpdatedBy: string;
  UpdatedOn: string;
}
interface GetProductByIdResponse {
  data: ProductById;
  statusCode: number;
  message: string;
}

interface ProductById {
  Id: string;
  ClientId: number;
  ClientName: string;
  ProjectId?: number;
  ProjectName?: string;
  ProductCategoryId: number;
  FabricTypeId: number;
  FabricName: string;
  FabricType: string
  Name: string;
  Description: string;
  CreatedOn: string;
  CreatedBy: string;
  UpdatedOn: string;
  UpdatedBy: string;
  printingOptions: [{ PrintingOptionId: number }];
  productColors: [{
    Id: number; colorId: number; ColorName: string;
    ImageId: string
  }];
  productDetails: [
    {
      Id: number;
      ProductCutOptionId: number;
      OptionProductCutOptions: string;
      SleeveTypeId: number;
      SleeveTypeName: string;
    }
  ];
  productSizes: [{ Id: number; sizeId: number }];
  productStatus: string;
  qaChecklist: {
    id: number;
    name: string;
    productId: number
  }[]
}

interface GetAvailableColorResponse {
  data: ProductAvailableColors[];
}

export interface ProductAvailableColors {
  Id: number;
  ColorName: string;
  ImageId: number;
}

// Attachments model for product gallery/doc center integrations
export interface ProductAttachmentItem {
  mediaId: number;
  fileName: string;
  fileType: string;
  fileUrl: string;
  tag: string | null;
}

export interface ProductAttachments {
  productId: number;
  productName: string;
  description: string;
  clientId: number;
  clientName: string;
  attachments: ProductAttachmentItem[];
}

// Pagination metadata returned by backend for attachments
interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

interface GetProductAttachmentsResponse {
  data: ProductAttachments[];
  message?: string;
}

interface GetProductAttachmentsPaginatedResponse {
  data: ProductAttachments[];
  pagination: PaginationMeta;
}

interface AddProduct {
  ProductCategoryId: number;
  FabricTypeId: number;
  Name: string;
  Description: string;
  CreatedBy: string;
  UpdatedBy: string;
}

interface AttachmentFilters {
  searchQuery?: string;
  clientId?: number | "all";
  productId?: number | "all";
}

interface CategoryState {
  products: Product[];
  productType: Product | null;
  productById: ProductById | null;
  productColorMap: ProductColorMap;
  productAvailableColors: ProductAvailableColors[];
  availableSizes: AvailableSizes[];
  availablePrintingOptions: PrintingOptionType[];
  productAttachments: ProductAttachments[];
  attachmentsPagination: PaginationMeta | null;
  attachmentsLoadingMore: boolean;
  attachmentsFilters: AttachmentFilters;
  loading: boolean;
  error: string | null;

  fetchProducts: () => Promise<void>;
  getProductByClientId: (clientId: number) => Promise<void>;
  fetchProductAvailableColors: (
    id: number
  ) => Promise<ProductAvailableColors[] | null>;
  fetchProductAvailablePrinting: (
    id: number
  ) => Promise<PrintingOptionType[] | null>;
  fetchAvailableSizes: (id: number) => Promise<AvailableSizes[] | null>;
  fetchProductAttachments: (filters?: AttachmentFilters) => Promise<void>;
  loadMoreProductAttachments: () => Promise<void>;
  getProductById: (id: number) => Promise<void>;
  addProduct: (
    productType: AddProduct
  ) => Promise<GetProductByIdResponse | null>;
  updateProduct: (
    id: number,
    productType: AddProduct,
    onSuccess: () => void
  ) => Promise<GetProductByIdResponse | null>;
  changeProductStatus: (
    id: number,
    productStatus: boolean,
    onSuccess: () => void
  ) => Promise<void>;
  deleteProduct: (id: number, onSuccess: () => void) => Promise<void>;
}

const useProductStore = create<CategoryState>((set, get) => ({
  products: [],
  productType: null,
  productById: null,
  productColorMap: {},
  productAvailableColors: [],
  availableSizes: [],
  availablePrintingOptions: [],
  productAttachments: [],
  attachmentsPagination: null,
  attachmentsLoadingMore: false,
  attachmentsFilters: {},
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/products`
      );
      if (!response.ok) {
        set({ loading: false, error: "Error Fetching Data" });
        const error = await response.json();
        toast.error(error.message || "Fail to fetch data.");
      }
      const data: GetProductsResponse = await response.json();
      set({ products: data.data, loading: false });
    } catch (error) {
      set({ loading: false, error: "Error Fetching Data" });
    }
  },

  getProductByClientId: async (clientId: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/products/client/${clientId}`
      );
      if (!response.ok) {
        set({ loading: false, error: "Error Fetching Data" });
        const error = await response.json();
        toast.error(error.message || "Fail to fetch data.");
        return;
      }
      const data: GetProductsResponse = await response.json();
      set({ products: data.data, loading: false });
    } catch (error) {
      set({ loading: false, error: "Error Fetching Data" });
      toast.error("Fail to fetch data.");
    }
  },

  fetchProductAttachments: async (filters?: AttachmentFilters) => {
    // Initial load with pagination (page=1, limit=10 by default)
    set({ loading: true, error: null });
    
    // Update filters state
    if (filters !== undefined) {
      set({ attachmentsFilters: filters });
    }
    
    const currentFilters = filters !== undefined ? filters : get().attachmentsFilters;
    
    // Build query parameters
    const params = new URLSearchParams();
    params.append("page", "1");
    params.append("limit", "10");
    
    // Add searchQuery if it exists and is 3+ characters
    if (currentFilters?.searchQuery && currentFilters.searchQuery.trim().length >= 3) {
      params.append("searchQuery", currentFilters.searchQuery.trim());
    }
    
    // Add clientId if it exists and is not "all"
    if (currentFilters?.clientId && currentFilters.clientId !== "all") {
      params.append("clientId", currentFilters.clientId.toString());
    }
    
    // Add productId if it exists and is not "all"
    if (currentFilters?.productId && currentFilters.productId !== "all") {
      params.append("productId", currentFilters.productId.toString());
    }
    
    const url = `${process.env.NEXT_PUBLIC_API_URL}/products/with-attachments/all?${params.toString()}`;
    
    try {
      const response = await fetchWithAuth(url);
      if (!response.ok) {
        set({ loading: false });
        const error = await response.json();
        toast.error(error.message || "Failed to fetch product attachments.");
        return;
      }
      const result: any = await response.json();
      // Support both shapes:
      // A) { data: Product[], pagination: {...} }
      // B) { data: { data: Product[], pagination: {...} }, statusCode, message, ... }
      const payload = (result && result.data && result.data.pagination !== undefined && Array.isArray(result.data.data))
        ? result.data
        : result;
      const items: ProductAttachments[] = Array.isArray(payload?.data) ? payload.data : [];
      const pagination: PaginationMeta | null = payload?.pagination ?? null;
      set({
        productAttachments: items,
        attachmentsPagination: pagination,
        loading: false,
      });
    } catch (error) {
      set({ loading: false, error: "Failed to fetch product attachments" });
      toast.error("Failed to fetch product attachments");
    }
  },

  loadMoreProductAttachments: async () => {
    const state = get();
    const meta = state.attachmentsPagination;
    if (!meta || !meta.hasMore) return;
    if (state.attachmentsLoadingMore) return;

    set({ attachmentsLoadingMore: true, error: null });
    
    // Build query parameters with current filters
    const params = new URLSearchParams();
    params.append("page", (meta.page + 1).toString());
    params.append("limit", meta.limit.toString());
    
    const filters = state.attachmentsFilters;
    if (filters.searchQuery && filters.searchQuery.trim().length >= 3) {
      params.append("searchQuery", filters.searchQuery.trim());
    }
    
    if (filters.clientId && filters.clientId !== "all") {
      params.append("clientId", filters.clientId.toString());
    }
    
    if (filters.productId && filters.productId !== "all") {
      params.append("productId", filters.productId.toString());
    }
    
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/products/with-attachments/all?${params.toString()}`
      );
      if (!response.ok) {
        set({ attachmentsLoadingMore: false });
        const error = await response.json();
        toast.error(error.message || "Failed to load more attachments.");
        return;
      }
      const result: any = await response.json();
      const payload = (result && result.data && result.data.pagination !== undefined && Array.isArray(result.data.data))
        ? result.data
        : result;
      const items: ProductAttachments[] = Array.isArray(payload?.data) ? payload.data : [];
      set((s) => ({
        productAttachments: [...(s.productAttachments || []), ...items],
        attachmentsPagination: payload?.pagination ?? s.attachmentsPagination,
        attachmentsLoadingMore: false,
      }));
    } catch (error) {
      set({ attachmentsLoadingMore: false, error: "Failed to load more attachments" });
      toast.error("Failed to load more attachments");
    }
  },

  fetchProductAvailableColors: async (
    id: number
  ): Promise<ProductAvailableColors[] | null> => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/products/availablecolors/${id}`
      );
      if (!response.ok) {
        set({ loading: false });
        const error = await response.json();
        toast.error(error.message || "Fail to fetch colors.");
        return null;
      }
      const data: GetAvailableColorResponse = await response.json();

      // Still update the store map
      set((state) => ({
        productColorMap: { ...state.productColorMap, [id]: data.data },
        loading: false,
      }));

      return data.data;
    } catch (error) {
      set({ error: "Failed to fetch product colors", loading: false });
      toast.error("Failed to fetch product colors");
      return null;
    }
  },

  fetchProductAvailablePrinting: async (
    id: number
  ): Promise<PrintingOptionType[] | null> => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/products/available-printing-options/${id}`
      );
      if (!response.ok) {
        set({ loading: false });
        const error = await response.json();
        toast.error(error.message || "Fail to fetch printing options.");
        return null;
      }
      const data: GetPrintingOptionsResponse = await response.json();

      // Update global store (optional)
      set({ availablePrintingOptions: data.data, loading: false });

      return data.data;
    } catch (error) {
      set({ error: "Failed to fetch printing options", loading: false });
      toast.error("Failed to fetch printing options");
      return null;
    }
  },

  fetchAvailableSizes: async (id: number): Promise<AvailableSizes[] | null> => {
    set({ loading: true, error: null });

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/products/available-sizes/${id}`
      );

      if (!response.ok) {
        set({ loading: false });
        const error = await response.json();
        toast.error(error.message || "Failed to fetch size options.");
        return null;
      }

      const data: GetAvailablSizesResponse = await response.json();

      // Update per-product sizeOptions map in Zustand
      set((state) => ({
        sizeOptions: {
          ...(state as any).sizeOptions, // Ensure key merging
          [id]: data.data,
        },
        loading: false,
      }));

      return data.data;
    } catch (error) {
      set({ error: "Failed to fetch size options", loading: false });
      toast.error("Failed to fetch size options");
      return null;
    }
  },

  // fetchAvailableSizes: async (id: number) => {
  //   set({ loading: true, error: null });
  //   try {
  //     const response = await fetchWithAuth(
  //       `${process.env.NEXT_PUBLIC_API_URL}/products/available-sizes/${id}`
  //     );
  //     if (!response.ok) {
  //       set({ loading: false });
  //       const error = await response.json();
  //       toast.error(error.message || "Fail to fetch data.");
  //       return;
  //     }
  //     const data: GetAvailablSizesResponse = await response.json();
  //     set({ availableSizes: data.data, loading: false });
  //   } catch (error) {
  //     set({ error: "Failed to fetch data", loading: false });
  //   }
  // },

  getProductById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`
      );
      if (!response.ok) {
        set({ loading: false, error: null });
        const error = await response.json();
        toast.error(error.message || "Fail to fetch data");
      }
      const data: GetProductByIdResponse = await response.json();
      set({ productById: data.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch product", loading: false });
      toast.error("Fail to add product");
    }
  },

  addProduct: async (
    productType: AddProduct
  ): Promise<GetProductByIdResponse | null> => {
    set({ loading: true, error: null });

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/products`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productType),
        }
      );
      const result: GetProductByIdResponse = await response.json();

      if (!response.ok) {
        set({ loading: false, error: null });
        toast.error(result.message || "Failed to add item");
        return null;
      }

      set({ loading: false, error: null });
      toast.success("Item added successfully");
      await get().fetchProducts();

      return result;
    } catch (error) {
      set({ error: "Failed to add item", loading: false });
      toast.error("Failed to add item");
      return null;
    }
  },

  updateProduct: async (
    id: number,
    productType: AddProduct
  ): Promise<GetProductByIdResponse | null> => {
    set({ loading: true, error: null });

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productType),
        }
      );
      const result: GetProductByIdResponse = await response.json();

      if (!response.ok) {
        set({ loading: false, error: null });
        toast.error(result.message || "Failed to update item");
        return null;
      }

      set({ loading: false, error: null });
      toast.success("Item update successfully");
      await get().fetchProducts();

      return result;
    } catch (error) {
      set({ error: "Failed to update item", loading: false });
      toast.error("Failed to update item");
      return null;
    }
  },

  changeProductStatus: async (
    id: number,
    productStatus: boolean,
    onSuccess?: () => void
  ) => {
    debugger;
    set({ loading: true, error: null });
    try {
      const payload = { isArchived: productStatus };
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/products/archive-status/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (response.ok) {
        set({ loading: false, error: null });
        if (onSuccess) onSuccess();
        toast.success("Product status updated successfully.");
        await get().fetchProducts();
      } else {
        set({ loading: false, error: null });
        const error = await response.json();
        toast.error(error.message || "Fail to updated product status");
      }
    } catch (error) {
      set({ error: "Failed to update product status", loading: false });
      toast.error("Fail to updated product status");
    }
  },

  deleteProduct: async (id: number, onSuccess?: () => void) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        set({ loading: false, error: null });
        if (onSuccess) onSuccess();
        toast.success("Product deleted successfully.");
        await get().fetchProducts();
      } else {
        set({ loading: false, error: null });
        const error = await response.json();
        toast.error(error.message || "Fail to delete product");
      }
    } catch (error) {
      set({ error: "Failed to delete products", loading: false });
      toast.error("Fail to delete product");
    }
  },
}));

export default useProductStore;
