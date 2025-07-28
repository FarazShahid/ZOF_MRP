import { Field, FieldArray } from "formik";
import React, { useEffect } from "react";
import { PRIORITY_ENUM } from "@/interface/GetFileType";
import Label from "../../components/common/Label";
import useProductStore from "@/store/useProductStore";
import useSizeMeasurementsStore, { GetSizeOptionsResponse } from "@/store/useSizeMeasurementsStore";
import { fetchWithAuth } from "../../services/authservice";
import toast from "react-hot-toast";

const OrderItemDetailsFieldArray = ({
  index,
  item,
  values,
  sizeOptions,
  productAvailableColors,
  setFieldValue,
}: {
  index: number;
  item: any;
  values: any;
  sizeOptions: any[];
  productAvailableColors: any[];
  
  setFieldValue: (field: string, value: any) => void;
}) => {

  const { fetchAvailableSizes } = useProductStore();
  const {
    fetchSizeMeasurementByClientAndSize,
  } = useSizeMeasurementsStore();


 // Initialize default detail if none exists
  useEffect(() => {
    if (!item.orderItemDetails || item.orderItemDetails.length === 0) {
      setFieldValue(`items[${index}].orderItemDetails`, [
        {
          ColorOptionId: null,
          SizeOption: 0,
          MeasurementId: 0,
          Quantity: 1,
          Priority: 0,
        },
      ]);
    }
  }, []);

 // 🔁 Fetch MeasurementId whenever SizeOption or ClientId changes
  useEffect(() => {
    const fetchMeasurements = async () => {
      
      const clientId = values.ClientId;
      if (!clientId) return;

      const promises = item.orderItemDetails?.map(async (detail: any, detailIndex: number) => {
        if (detail.SizeOption) {
          const measurement = await fetchSizeMeasurementByClientAndSize(clientId, detail.SizeOption);
          if (measurement?.Id) {
            setFieldValue(
              `items[${index}].orderItemDetails[${detailIndex}].MeasurementId`,
              measurement.Id
            );
          }
        }
      });

      await Promise.all(promises);
    };

    fetchMeasurements();
  }, [item.orderItemDetails, values.ClientId]);


  return (
    <FieldArray name={`items[${index}].orderItemDetails`}>
      {(detailsHelpers) => (
        <div className="mb-4">
          {item.orderItemDetails && item.orderItemDetails.length > 0 ? (
            item.orderItemDetails.map((detail: any, detailIndex: number) => (
              <div className="" key={detailIndex}>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div>
                    <Label isRequired label="Quantity" />
                    <Field
                      type="number"
                      name={`items[${index}].orderItemDetails[${detailIndex}].Quantity`}
                      className="rounded-xl dark:text-gray-400 text-black text-sm p-2 w-full outline-none dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100"
                      min={1}
                    />
                  </div>
                  <div>
                    <Label isRequired label="Priority" />
                    <Field
                      as="select"
                      name={`items[${index}].orderItemDetails[${detailIndex}].Priority`}
                      className="rounded-xl dark:text-gray-400 text-black text-sm p-2 w-full outline-none dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100"
                    >
                      <option value="">Select Priority</option>
                      {PRIORITY_ENUM.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </Field>
                  </div>
                   <div>
                    <Label isRequired label="Size Options" />
                    <Field
                      as="select"
                      name={`items[${index}].orderItemDetails[${detailIndex}].SizeOption`}
                      className="rounded-xl dark:text-gray-400 text-black text-sm p-2 w-full outline-none dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100"
                    >
                      <option value="">Select a size option</option>
                      {sizeOptions?.map((size, index) => (
                        <option value={size?.SizeId} key={index}>
                          {size?.SizeName}
                        </option>
                      ))}
                    </Field>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                 
                  {/* Hidden MeasurementId */}
                <Field
                  type="hidden"
                  name={`items[${index}].orderItemDetails[${detailIndex}].MeasurementId`}
                />
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
                          ColorOptionId: null,
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
