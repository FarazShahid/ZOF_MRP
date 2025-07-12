import React, { useEffect, useState } from "react";
import { FieldArray } from "formik";
import { useFormikContext } from "formik";
import useProductStore from "@/store/useProductStore";
import SearchableProductSelect from "./SearchableProductSelect";
import usePrintingOptionsStore from "@/store/usePrintingOptionsStore";
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

  const { fetchProducts, products, fetchProductAvailableColors } =
    useProductStore();
  const { fetchprintingOptions, printingOptions } = usePrintingOptionsStore();

  useEffect(() => {
    fetchProducts();
    fetchprintingOptions();
  }, []);

  useEffect(() => {
    if (values.items.length > 0) {
      const lastItem = values.items[values.items.length - 1];
      if (lastItem?.ProductId) {
        fetchProductAvailableColors(lastItem.ProductId);
      }
    }
  }, [values.items.length]);

  const addProduct = (selected: { Id: number; productName: string }) => {
    setSelectedProduct(selected);

    const exists = values.items.some(
      (item: any) => item.ProductId === selected.Id
    );
    if (exists) return;

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

  return (
    <div className="space-y-6 w-[700px]">
      <div className="mb-3 flex items-center justify-center">
        {values.ClientId ? (
          <SearchableProductSelect
            products={products.filter(
              (p) => p.ClientId === Number(values.ClientId)
            )}
            onSelect={addProduct}
          />
        ) : (
          <span className="text-sm text-gray-500">
            Please select a client first to view products.
          </span>
        )}
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
                printingOptions={printingOptions}
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
  );
};

export default Step2;
