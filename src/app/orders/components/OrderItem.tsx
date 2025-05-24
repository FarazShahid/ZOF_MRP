import React from "react";
import { ProductProp } from "./Step2";
import Label from "../../components/common/Label";
import SearchableProductSelect, { Product } from "./SearchableProductSelect";
import { ErrorMessage } from "formik";
import TextAreaField from "./TextAreaField";
import SelectField from "./SelectField";
import { PRIORITY_ENUM } from "@/interface/GetFileType";
import PrintingOptionsMultiSelect from "./PrintingOptionsMultiSelect";
import OrderItemDetailsFieldArray from "./OrderItemDetailsFieldArray";
import DropZone from "../../components/DropZone/DropZone";

interface OrderItemProps {
  index: number;
  item: any;
  values: any;
  selectedProduct: ProductProp | undefined;
  removeItem: () => void;
  productAvailableColors: any[];
  printingOptions: any[];
  setFieldValue: (field: string, value: any) => void;
}

const OrderItem: React.FC<OrderItemProps> = ({
  index,
  item,
  values,
  selectedProduct,
  removeItem,
  productAvailableColors,
  printingOptions,
  setFieldValue,
}) => {
  return (
    <div className="space-y-3 border-1 border-gray-800 p-4 rounded relative">
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

          <h4 className="font-semibold mb-3">
            {item?.Description}
          </h4>

          <OrderItemDetailsFieldArray
            index={index}
            item={item}
            productAvailableColors={productAvailableColors}
            setFieldValue={setFieldValue}
          />
          <div className="grid grid-cols-2 gap-2">
            <SelectField
              label="Order Item Priority"
              name={`items[${index}].OrderItemPriority`}
              options={PRIORITY_ENUM}
            />
            <PrintingOptionsMultiSelect
              index={index}
              item={item}
              printingOptions={printingOptions}
              setFieldValue={setFieldValue}
            />
          </div>
          <DropZone />
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
