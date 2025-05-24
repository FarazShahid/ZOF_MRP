import React, { useEffect, useState } from "react";
import {  FieldArray } from "formik";
import { useFormikContext } from "formik";
import useProductStore from "@/store/useProductStore";
import SearchableProductSelect from "./SearchableProductSelect";
import usePrintingOptionsStore from "@/store/usePrintingOptionsStore";
import OrderItem from "./OrderItem";

export interface ProductProp {
  Id: number;
  productName: string;
}

const Step2 = ({ formik }: { formik: any }) => {
  const { values, setFieldValue } = useFormikContext<any>();
  const [selectedProduct, setSelectedProduct] = useState<ProductProp>();
  const {
    fetchProducts,
    products,
    fetchProductAvailableColors,
    productAvailableColors,
  } = useProductStore();
  const { fetchprintingOptions, printingOptions } = usePrintingOptionsStore();

  useEffect(() => {
    fetchProducts();
    fetchprintingOptions();
  }, []);

  useEffect(() => {
    if (values.items.length > 0) {
      const lastProductId = values.items[values.items.length - 1].ProductId;
      if (lastProductId) {
        fetchProductAvailableColors(lastProductId);
      }
    }
  }, [values.items, fetchProductAvailableColors]);


  const addProduct = (selected: { Id: number; productName: string }) => {
    setSelectedProduct(selected);

    const exists = values.items.some((item: any) => item.ProductId === selected.Id);
    if (exists) return;

    const newItem = {
      ProductId: selected.Id,
      Description: selected.productName,
      OrderItemPriority: "",
      ImageId: 1,
      FileId: 2,
      VideoId: 3,
      printingOptions: [],
      orderItemDetails: [],
    };

    setFieldValue("items", [...values.items, newItem]);
  };

  return (
    <div className="space-y-6 w-[700px]">
       <div className="mb-3 flex items-center justify-center">
        <SearchableProductSelect products={products} onSelect={addProduct} />
      </div>
      <FieldArray name="items">
        {(itemsHelpers) => (
          <>
            {values.items.map((item: any, index: number) => (
              <OrderItem
                key={index}
                index={index}
                item={item}
                values={values}
                removeItem={() => values.items.length > 1 && itemsHelpers.remove(index)}
                productAvailableColors={productAvailableColors}
                printingOptions={printingOptions}
                setFieldValue={setFieldValue}
                selectedProduct={selectedProduct}
              />
            ))}
          </>
        )}
      </FieldArray>
    </div>
  );
};

export default Step2;
