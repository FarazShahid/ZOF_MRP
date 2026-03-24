import { Field, FieldArray } from "formik";
import React, { useEffect, useState } from "react";
import { PRIORITY_ENUM } from "@/interface/GetFileType";
import Label from "../../components/common/Label";
import useSizeMeasurementsStore, { SizeMeasurements } from "@/store/useSizeMeasurementsStore";

const OrderItemDetailsFieldArray = ({
  index,
  item,
  sizeOptions,
  setFieldValue,
}: {
  index: number;
  item: any;
  values: any;
  sizeOptions: any[];
  productAvailableColors: any[];

  setFieldValue: (field: string, value: any) => void;
}) => {
  const { getMeasurementsBySizeOption } = useSizeMeasurementsStore();
  const [, setMeasurementOptionsByDetail] = useState<Record<number, SizeMeasurements[]>>({});

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

  const handleSizeChange = async (e: React.ChangeEvent<HTMLSelectElement>, detailIndex: number) => {
    const selectedSizeId = Number(e.target.value);
    setFieldValue(`items[${index}].orderItemDetails[${detailIndex}].SizeOption`, selectedSizeId);

    if (!selectedSizeId) {
      setMeasurementOptionsByDetail((prev) => ({ ...prev, [detailIndex]: [] }));
      setFieldValue(`items[${index}].orderItemDetails[${detailIndex}].MeasurementId`, 0);
      return;
    }

    const list = await getMeasurementsBySizeOption(selectedSizeId);
    setMeasurementOptionsByDetail((prev) => ({ ...prev, [detailIndex]: list }));

    if (Array.isArray(list) && list.length > 1) {
      // Prefer IsLatest, fallback to highest Version
      const latest =
        list.find((m) => m.IsLatest) ||
        [...list].sort((a, b) => (b.Version || 0) - (a.Version || 0))[0];
      if (latest?.Id) {
        setFieldValue(`items[${index}].orderItemDetails[${detailIndex}].MeasurementId`, latest.Id);
      }
    } else {
      // Single or none → omit MeasurementId (backend will use latest)
      setFieldValue(`items[${index}].orderItemDetails[${detailIndex}].MeasurementId`, 0);
    }
  };

 

  const fieldStyle =
    "w-full bg-slate-800 text-white text-sm px-4 py-3 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 transition-colors";
  const selectStyle = fieldStyle + " cursor-pointer";

  return (
    <FieldArray name={`items[${index}].orderItemDetails`}>
      {(detailsHelpers) => (
        <div className="mb-4">
          {item.orderItemDetails && item.orderItemDetails.length > 0 ? (
            item.orderItemDetails.map((detail: any, detailIndex: number) => (
              <div key={detailIndex} className="mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label isRequired label="Quantity" />
                    <Field
                      type="number"
                      name={`items[${index}].orderItemDetails[${detailIndex}].Quantity`}
                      className={fieldStyle}
                      min={1}
                      step="1"
                      onKeyDown={(e: {
                        key: string;
                        preventDefault: () => void;
                      }) => {
                        if (
                          e.key === "." ||
                          e.key === "e" ||
                          e.key === "-" ||
                          e.key === "+"
                        ) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label isRequired={false} label="Priority" />
                    <Field
                      as="select"
                      name={`items[${index}].orderItemDetails[${detailIndex}].Priority`}
                      className={selectStyle}
                    >
                      <option value="">Select Priority</option>
                      {PRIORITY_ENUM.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </Field>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label isRequired={false} label="Size Options" />
                    <Field
                      as="select"
                      name={`items[${index}].orderItemDetails[${detailIndex}].SizeOption`}
                      className={selectStyle}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleSizeChange(e, detailIndex)}
                    >
                      <option value="">Select a size option</option>
                      {sizeOptions?.map((size, idx) => (
                        <option value={size?.SizeId} key={idx}>
                          {size?.SizeName}
                        </option>
                      ))}
                    </Field>
 
                  </div>
                </div>
                <div className="flex items-center justify-end w-full gap-2 mt-2">
                  {item.orderItemDetails.length > 1 && (
                    <button
                      type="button"
                      onClick={() => detailsHelpers.remove(detailIndex)}
                      className="px-3 py-1.5 text-red-400 hover:bg-red-500/10 rounded-lg text-sm font-medium transition-colors"
                      aria-label="Remove order item detail"
                    >
                      <i className="ri-subtract-line w-4 h-4 inline-flex" /> Remove
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
                      className="px-3 py-1.5 text-green-400 hover:bg-green-500/10 rounded-lg text-sm font-medium transition-colors"
                      aria-label="Add order item detail"
                    >
                      <i className="ri-add-line w-4 h-4 inline-flex" /> Add
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
