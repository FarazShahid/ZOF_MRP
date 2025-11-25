import { Field, FieldArray } from "formik";
import React, { useEffect, useMemo, useState } from "react";
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
  const [measurementOptionsByDetail, setMeasurementOptionsByDetail] = useState<Record<number, SizeMeasurements[]>>({});

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

  const buildNameLabel = (m: SizeMeasurements) => {
    return m.Measurement1 || m.SizeOptionName || "Measurement";
  };

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
                  <div>
                    <Label isRequired={false} label="Priority" />
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
                    <Label isRequired={false} label="Size Options" />
                    <Field
                      as="select"
                      name={`items[${index}].orderItemDetails[${detailIndex}].SizeOption`}
                      className="rounded-xl dark:text-gray-400 text-black text-sm p-2 w-full outline-none dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100"
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleSizeChange(e, detailIndex)}
                    >
                      <option value="">Select a size option</option>
                      {sizeOptions?.map((size, idx) => (
                        <option value={size?.SizeId} key={idx}>
                          {size?.SizeName}
                        </option>
                      ))}
                    </Field>
                    {/* Measurement version selector or display */}
                    {Array.isArray(measurementOptionsByDetail[detailIndex]) &&
                      measurementOptionsByDetail[detailIndex].length > 1 && (
                        <div className="mt-2">
                          <Label isRequired={false} label="Size measurement version" />
                          <Field
                            as="select"
                            name={`items[${index}].orderItemDetails[${detailIndex}].MeasurementId`}
                            className="rounded-xl dark:text-gray-400 text-black text-sm p-2 w-full outline-none dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100"
                          >
                            {(() => {
                              const list = measurementOptionsByDetail[detailIndex] || [];
                              const sorted = [...list].sort((a, b) => {
                                // Keep latest first to align with auto-selection, but labels are name only
                                if (a.IsLatest && !b.IsLatest) return -1;
                                if (!a.IsLatest && b.IsLatest) return 1;
                                return (b.Version || 0) - (a.Version || 0);
                              });
                              return sorted.map((m) => (
                                <option key={m.Id} value={m.Id}>
                                  {buildNameLabel(m)}
                                </option>
                              ));
                            })()}
                          </Field>
                        </div>
                      )}
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
