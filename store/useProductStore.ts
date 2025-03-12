import { fetchWithAuth } from "@/src/app/services/authservice";
import { create } from "zustand";

interface Product {
  Id: number;
  Name: string;
  ProductCategoryId: number;
  ProductCategoryName: string;
  FabricTypeId: number;
  FabricType: string;
  FabricName: string;
  GSM: number;
  Description: string;
  CreatedBy: string;
  UpdatedBy: string;
}
interface ProductById {
  Id: string;
  ProductCategoryId: number;
  FabricTypeId: number;
  Name: string;
  Description: string;
  CreatedOn: string;
  CreatedBy: string;
  UpdatedOn: string;
  UpdatedBy: string;
  productColors: [{ Id: number; colorId: number; ImageId: string }];
  productDetails: [
    {
      Id: number;
      ProductId: number;
      ProductCutOptionId: number;
      ProductSizeMeasurementId: number;
      ProductRegionId: number;
      SleeveTypeId: number;
    }
  ];
}

interface ProductAvailableColors {
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
  productAvailableColors: ProductAvailableColors[];
  loading: boolean;
  error: string | null;

  fetchProducts: () => Promise<void>;
  fetchProductAvailableColors: (id: number) => Promise<void>;
  getProductById: (id: number) => Promise<void>;
  addProduct: (productType: AddProduct, onSuccess: () => void) => Promise<void>;
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
  productAvailableColors: [],
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
      }
      const data: Product[] = await response.json();
      set({ products: data, loading: false });
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
      const data: ProductAvailableColors[] = await response.json();
      set({ productAvailableColors: data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch product colors", loading: false });
    }
  },

  getProductById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`
      );
      const data: ProductById = await response.json();
      set({ productById: data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch product", loading: false });
    }
  },

  addProduct: async (productType: AddProduct, onSuccess?: () => void) => {
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

      if (!response.ok) throw new Error("Failed to add product");
      set({ loading: false, error: null });
      if (onSuccess) onSuccess();
      await get().fetchProducts();
    } catch (error) {
      set({ error: "Failed to add product", loading: false });
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

      if (!response.ok) throw new Error("Failed to update product");
      set({ loading: false, error: null });
      if (onSuccess) onSuccess();
      await get().fetchProducts();
    } catch (error) {
      set({ error: "Failed to update product", loading: false });
    }
  },

  deleteProduct: async (id: number, onSuccess?: () => void) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete product");
      set({ loading: false, error: null });
      if (onSuccess) onSuccess();
      await get().fetchProducts();
    } catch (error) {
      set({ error: "Failed to delete products", loading: false });
    }
  },
}));

export default useProductStore;
