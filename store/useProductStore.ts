import { fetchWithAuth } from "@/src/app/services/authservice";
import toast from "react-hot-toast";
import { create } from "zustand";

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
  UpdatedBy: string;
}
interface GetProductByIdResponse {
  data: ProductById;
  statusCode: number;
  message: string;
}

interface ProductById {
  Id: string;
  ClientId: number;
  ProductCategoryId: number;
  FabricTypeId: number;
  Name: string;
  Description: string;
  CreatedOn: string;
  CreatedBy: string;
  UpdatedOn: string;
  UpdatedBy: string;
  printingOptions: [{ PrintingOptionId: number }];
  productColors: [{ Id: number; colorId: number; ImageId: string }];
  productDetails: [
    {
      Id: number;
      // ProductId: number;
      ProductCutOptionId: number;
      // ProductSizeMeasurementId: number;
      // ProductRegionId: number;
      SleeveTypeId: number;
    }
  ];
  productSizes: [{ Id: number; sizeId: number }];
  productStatus: string;
}

interface GetAvailableColorResponse {
  data: ProductAvailableColors[];
}

export interface ProductAvailableColors {
  Id: number;
  ColorName: string;
  ImageId: number;
}

interface AddProduct {
  ProductCategoryId: number;
  FabricTypeId: number;
  Name: string;
  Description: string;
  CreatedBy: string;
  UpdatedBy: string;
}

interface CategoryState {
  products: Product[];
  productType: Product | null;
  productById: ProductById | null;
  productColorMap: ProductColorMap;
  productAvailableColors: ProductAvailableColors[];
  availableSizes: AvailableSizes[];
  loading: boolean;
  error: string | null;

  fetchProducts: () => Promise<void>;
  fetchProductAvailableColors: (id: number) => Promise<void>;
  fetchProductAvailablePrinting: (id: number) => Promise<void>;
  fetchAvailableSizes: (id: number) => Promise<void>;
  getProductById: (id: number) => Promise<void>;
  addProduct: (
    productType: AddProduct
  ) => Promise<GetProductByIdResponse | null>;
  updateProduct: (
    id: number,
    productType: AddProduct,
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

  fetchProductAvailableColors: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/products/availablecolors/${id}`
      );
      if (!response.ok) {
        set({ loading: false });
        const error = await response.json();
        toast.error(error.message || "Fail to fetch data.");
        return;
      }
      const data: GetAvailableColorResponse = await response.json();
      set((state) => ({
        productColorMap: { ...state.productColorMap, [id]: data.data },
        loading: false,
      }));
    } catch (error) {
      set({ error: "Failed to fetch product colors", loading: false });
    }
  },

  fetchProductAvailablePrinting: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/products/availablecolors/${id}`
      );
      if (!response.ok) {
        set({ loading: false });
        const error = await response.json();
        toast.error(error.message || "Fail to fetch data.");
        return;
      }
      const data: GetAvailableColorResponse = await response.json();
      set((state) => ({
        productColorMap: { ...state.productColorMap, [id]: data.data },
        loading: false,
      }));
    } catch (error) {
      set({ error: "Failed to fetch product colors", loading: false });
    }
  },

  fetchAvailableSizes: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/products/available-sizes/${id}`
      );
      if (!response.ok) {
        set({ loading: false });
        const error = await response.json();
        toast.error(error.message || "Fail to fetch data.");
        return;
      }
      const data: GetAvailablSizesResponse = await response.json();
      set({ availableSizes: data.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch data", loading: false });
    }
  },

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

  // addProduct: async (productType: AddProduct, onSuccess?: () => void) => {
  //   set({ loading: true, error: null });
  //   try {
  //     const response = await fetchWithAuth(
  //       `${process.env.NEXT_PUBLIC_API_URL}/products`,
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(productType),
  //       }
  //     );

  //     if (response.ok) {
  //       set({ loading: false, error: null });
  //       const data: GetProductByIdResponse = await response.json();

  //       if (onSuccess) onSuccess();
  //       toast.success("Product added successfully.");
  //       await get().fetchProducts();

  //     } else {
  //       set({ loading: false, error: null });
  //       const error = await response.json();
  //       toast.error(error.message || "Fail to add product");
  //     }
  //   } catch (error) {
  //     set({ error: "Failed to add product", loading: false });
  //     toast.error("Fail to add product");
  //   }
  // },

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
    productType: AddProduct,
    onSuccess?: () => void
  ) => {
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
      if (response.ok) {
        set({ loading: false, error: null });
        if (onSuccess) onSuccess();
        toast.success("Product updated successfully.");
        await get().fetchProducts();
      } else {
        set({ loading: false, error: null });
        const error = await response.json();
        toast.error(error.message || "Fail to updated product");
      }
    } catch (error) {
      set({ error: "Failed to update product", loading: false });
      toast.error("Fail to updated product");
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
