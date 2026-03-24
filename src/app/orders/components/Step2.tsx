import React, { useEffect, useState } from "react";
import { FieldArray } from "formik";
import { useFormikContext } from "formik";
import useProductStore from "@/store/useProductStore";
import SearchableProductSelect from "./SearchableProductSelect";
import OrderItem from "./OrderItem";

export interface ProductProp {
  Id: number;
  productName: string;
}

type Step2Props = {
  formik: any;
  itemFiles: Record<number, File | null>;
  onFileSelect: (file: File, index: number) => void;
};

const Step2: React.FC<Step2Props> = ({ itemFiles, onFileSelect }) => {
  const { values, setFieldValue } = useFormikContext<any>();
  const [selectedProduct, setSelectedProduct] = useState<ProductProp>();
  const [productDataMap, setProductDataMap] = useState<
    Record<
      number,
      {
        printingOptions: any[];
        sizeOptions: any[];
      }
    >
  >({});

  const {
    fetchProducts,
    products,
    fetchProductAvailableColors,
    fetchProductAvailablePrinting,
    fetchAvailableSizes,
  } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (values.items.length > 0) {
      const lastItem = values.items[values.items.length - 1];
      if (lastItem?.ProductId) {
        fetchProductAvailableColors(lastItem.ProductId);
        fetchProductAvailablePrinting(lastItem.ProductId);
      }
    }
  }, [values.items.length]);

  const addProduct = async (selected: { Id: number; productName: string }) => {
    setSelectedProduct(selected);

    const exists = values.items.some(
      (item: any) => item.ProductId === selected.Id
    );
    if (exists) return;

    // Fetch size and printing options for the new product
    const [printingOptions, sizeOptions] = await Promise.all([
      fetchProductAvailablePrinting(selected.Id),
      fetchAvailableSizes(selected.Id),
    ]);

    setProductDataMap((prev) => ({
      ...prev,
      [selected.Id]: {
        printingOptions: printingOptions || [],
        sizeOptions: sizeOptions || [],
      },
    }));

    const newItem = {
      ProductId: selected.Id,
      Description: selected.productName,
      OrderItemPriority: "",
      ImageId: null,
      FileId: null,
      VideoId: null,
      printingOptions: [],
      orderItemDetails: [],
    };

    setFieldValue("items", [...values.items, newItem]);
  };

  useEffect(() => {
    values.items.forEach((item: any, idx: number) => {
      const pid = item.ProductId;
      if (pid && !productDataMap[pid]) {
        Promise.all([
          fetchProductAvailablePrinting(pid),
          fetchAvailableSizes(pid),
        ]).then(([printingOpts, sizeOpts]) => {
          setProductDataMap((prev) => ({
            ...prev,
            [pid]: {
              printingOptions: printingOpts || [],
              sizeOptions: sizeOpts || [],
            },
          }));
        });
      }
    });
  }, [
    values.items,
    fetchAvailableSizes,
    fetchProductAvailablePrinting,
    productDataMap,
  ]);

  return (
    <div className="space-y-6 w-full max-w-4xl">
      {/* Add Products - main heading with icon */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <i className="ri-add-box-line text-white text-lg flex items-center justify-center" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Add Products</h2>
            <p className="text-xs text-slate-400">Search and add products to this order</p>
          </div>
        </div>
        <div>
          {values.ClientId ? (
            <SearchableProductSelect
              products={products.filter(
                (p) =>
                  p.ClientId === Number(values.ClientId) && p.isArchived === false
              )}
              onSelect={addProduct}
            />
          ) : (
            <span className="text-sm text-slate-400">
              Please select a client first to view products.
            </span>
          )}
        </div>
      </div>

      {/* Order Items - heading with icon and count */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center">
              <i className="ri-shopping-bag-line text-white text-lg flex items-center justify-center" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Order Items</h2>
              <p className="text-xs text-slate-400">
                {values.items?.length || 0} {values.items?.length === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
        </div>
        <FieldArray name="items">
          {(itemsHelpers) => (
            <>
              {values.items.map((item: any, index: number) => (
                <OrderItem
                  key={index}
                  item={item}
                  values={values}
                  removeItem={() => itemsHelpers.remove(index)}
                  printingOptions={
                    productDataMap[item.ProductId]?.printingOptions || []
                  }
                  sizeOptions={productDataMap[item.ProductId]?.sizeOptions || []}
                  setFieldValue={setFieldValue}
                  selectedProduct={selectedProduct}
                  index={index}
                  handleFileSelect={onFileSelect}
                  selectedFile={itemFiles[index] || null}
                />
              ))}
            </>
          )}
        </FieldArray>
      </div>
    </div>
  );
};

export default Step2;
