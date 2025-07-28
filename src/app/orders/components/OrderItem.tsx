import React, { useEffect, useState } from "react";
import { useProductColorsByProductId } from "@/interface/useHandleProdcutColors";
import { ProductProp } from "./Step2";
import TextAreaField from "./TextAreaField";
import PrintingOptionsMultiSelect from "./PrintingOptionsMultiSelect";
import OrderItemDetailsFieldArray from "./OrderItemDetailsFieldArray";
import DropZone from "../../components/DropZone/DropZone";
import RecentAttachmentsView from "../../components/RecentAttachmentsView";
import { DOCUMENT_REFERENCE_TYPE } from "@/interface";

interface OrderItemProps {
  index: number;
  item: any;
  values: any;
  selectedProduct: ProductProp | undefined;
  removeItem: () => void;
  sizeOptions: any[];
  printingOptions: any[];
  setFieldValue: (field: string, value: any) => void;
  handleFileSelect: (file: File, index: number) => void;
  selectedFile: File | null;
}

const OrderItem: React.FC<OrderItemProps> = ({
  index,
  item,
  values,
  selectedProduct,
  removeItem,
  sizeOptions,
  printingOptions,
  setFieldValue,
  handleFileSelect,
  selectedFile,
}) => {
  const currentProductColors = useProductColorsByProductId(item?.ProductId);
  const [productName, setProductName] = useState("");

  useEffect(() => {
    if (item?.Description) {
      setProductName(item?.Description);
    }
  }, []);

  return (
    <div className="space-y-3 border-1 dark:border-gray-800 border-gray-400 p-4 rounded relative">
      {item && (
        <>
          <button
            type="button"
            onClick={removeItem}
            className="absolute top-2 right-2 bg-red-400 rounded-lg px-2 font-bold hover:bg-red-700"
            aria-label={`Remove item ${index + 1}`}
          >
            &minus;
          </button>

          <h4 className="font-semibold mb-3">{productName}</h4>

          <OrderItemDetailsFieldArray
            index={index}
            item={item}
            values={values}
            sizeOptions={sizeOptions}
            productAvailableColors={currentProductColors}
            setFieldValue={setFieldValue}
          />
          <div className="grid grid-cols-2 gap-2">
            <PrintingOptionsMultiSelect
              index={index}
              item={item}
              printingOptions={printingOptions}
              setFieldValue={setFieldValue}
            />
          </div>

          {selectedProduct ? (
            <RecentAttachmentsView
              referenceId={item.ProductId}
              referenceType={DOCUMENT_REFERENCE_TYPE.PRODUCT}
            />
          ) : (
            <></>
          )}

          <TextAreaField
            label="Description"
            name={`items[${index}].Description`}
          />
        </>
      )}
    </div>
  );
};

export default OrderItem;
