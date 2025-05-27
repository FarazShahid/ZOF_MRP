import { Field, FieldArray } from "formik";
import React, { useEffect } from "react";
import { PRIORITY_ENUM } from "@/interface/GetFileType";
import Label from "../../components/common/Label";

const OrderItemDetailsFieldArray = ({
  index,
  item,
  productAvailableColors,
  setFieldValue,
}: {
  index: number;
  item: any;
  productAvailableColors: any[];
  setFieldValue: (field: string, value: any) => void;
}) => {
  useEffect(() => {
    if (!item.orderItemDetails || item.orderItemDetails.length === 0) {
      setFieldValue(`items[${index}].orderItemDetails`, [
        {
          ColorOptionId: "",
          Quantity: 1,
          Priority: 0,
        },
      ]);
    }
  }, []);

  return (
    <FieldArray name={`items[${index}].orderItemDetails`}>
      {(detailsHelpers) => (
        <div className="mb-4">
          {item.orderItemDetails && item.orderItemDetails.length > 0 ? (
            item.orderItemDetails.map((detail: any, detailIndex: number) => (
              <div className="" key={detailIndex}>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div>
                    <Label isRequired label="Color Option" />
                    <Field
                      as="select"
                      name={`items[${index}].orderItemDetails[${detailIndex}].ColorOptionId`}
                      className="rounded-xl text-gray-400 text-sm p-2 outline-none bg-gray-950 border-1 border-gray-600 w-full"
                    >
                      <option value="">Select a color</option>
                      {productAvailableColors.map((color) => (
                        <option value={color.Id} key={color.Id}>
                          {color.ColorName}
                        </option>
                      ))}
                    </Field>
                  </div>
                  <div>
                    <Label isRequired label="Quantity" />
                    <Field
                      type="number"
                      name={`items[${index}].orderItemDetails[${detailIndex}].Quantity`}
                      className="rounded-xl text-gray-400 text-sm p-2 outline-none bg-gray-950 border-1 border-gray-600 w-full"
                      min={1}
                    />
                  </div>
                  <div>
                    <Label isRequired label="Priority" />
                    <Field
                      as="select"
                      name={`items[${index}].orderItemDetails[${detailIndex}].Priority`}
                      className="rounded-xl text-gray-400 text-sm p-2 outline-none bg-gray-950 border-1 border-gray-600 w-full"
                    >
                      <option value="">Select Priority</option>
                      {PRIORITY_ENUM.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </Field>
                  </div>
                </div>
                <div className="flex items-center justify-end w-full space-x-2">
                  {item.orderItemDetails.length > 1 && (
                    <button
                      type="button"
                      onClick={() => detailsHelpers.remove(detailIndex)}
                      className="bg-red-500 hover:bg-red-700 text-white rounded-lg px-2 font-bold"
                      aria-label="Remove order item detail"
                    >
                      &minus;
                    </button>
                  )}
                  {detailIndex === item.orderItemDetails.length - 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        detailsHelpers.push({
                          ColorOptionId: "",
                          Quantity: 1,
                          Priority: 0,
                        })
                      }
                      className="bg-green-600 hover:bg-green-800 text-white rounded-lg px-2 font-bold"
                      aria-label="Add order item detail"
                    >
                      +
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
      )}
    </FieldArray>
  );
};

export default OrderItemDetailsFieldArray;
