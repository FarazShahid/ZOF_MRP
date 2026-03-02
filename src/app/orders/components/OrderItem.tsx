import React, { useEffect, useState } from "react";
import { useProductColorsByProductId } from "@/interface/useHandleProdcutColors";
import { ProductProp } from "./Step2";
import TextAreaField from "./TextAreaField";
import PrintingOptionsMultiSelect from "./PrintingOptionsMultiSelect";
import OrderItemDetailsFieldArray from "./OrderItemDetailsFieldArray";
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
    <div className="space-y-4 rounded-xl border border-slate-700 bg-slate-800/50 p-5 relative">
      {item && (
        <>
          <button
            type="button"
            onClick={removeItem}
            className="absolute top-3 right-3 p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            aria-label={`Remove item ${index + 1}`}
          >
            <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center" />
          </button>

          <h4 className="font-semibold text-white mb-4 pr-10">{productName}</h4>

          <OrderItemDetailsFieldArray
            index={index}
            item={item}
            values={values}
            sizeOptions={sizeOptions}
            productAvailableColors={currentProductColors}
            setFieldValue={setFieldValue}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
