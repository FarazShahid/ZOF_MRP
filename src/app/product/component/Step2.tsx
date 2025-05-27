import useCutOptionsStore from "@/store/useCutOptionsStore";
import { Field, ErrorMessage, FieldArray } from "formik";
import { FaCirclePlus } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { FaRegEye } from "react-icons/fa";
import { useEffect } from "react";
import useClientStore from "@/store/useClientStore";
import useSleeveType from "@/store/useSleeveType";
import useSizeMeasurementsStore from "@/store/useSizeMeasurementsStore";

export default function Step2({ formik }: any) {
  const { fetchcutOptions, cutOptions } = useCutOptionsStore();
  const { fetchClients, clients } = useClientStore();
  const { fetchSleeveType, sleeveTypeData } = useSleeveType();
  const { fetchSizeMeasurements, sizeMeasurement } = useSizeMeasurementsStore();

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchcutOptions(),
        fetchClients(),
        fetchSleeveType(),
        fetchSizeMeasurements(),
      ]);
    };
    fetchData();
  }, []);

  const getSortedSizeMeasurements = (clientId: number | string) => {
    if (!sizeMeasurement || !Array.isArray(sizeMeasurement)) return [];
    const topMatches = sizeMeasurement.filter((item) => item.ClientId === Number(clientId));
    const others = sizeMeasurement.filter((item) => item.ClientId !== Number(clientId));
    return [...topMatches, ...others];
  };

  return (
    <div className="space-y-6 w-[500px]">
      <FieldArray name="productDetails">
        {({ push, remove, form }) => (
          <>
            {form?.values?.productDetails?.map((_: any, index: number) => {
              const selectedClientId = form.values.productDetails[index]?.ClientId;
              const sortedMeasurements = getSortedSizeMeasurements(selectedClientId);
            return(
              <div
                key={index}
                className="border-1 border-gray-800 space-y-6 rounded p-4"
                id="productDetails"
              >
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-400">
                      Cut Options
                    </label>
                    <Field
                      as="select"
                      name={`productDetails[${index}].ProductCutOptionId`}
                      className="rounded-xl text-gray-400 text-sm p-2 w-full outline-none bg-gray-950 border-1 border-gray-600"
                    >
                      <option value={""}>Select an option</option>
                      {cutOptions?.map((cutOption, i) => (
                        <option key={i} value={cutOption?.Id}>
                          {cutOption?.OptionProductCutOptions}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name={`productDetails[${index}].ProductCutOptionId`}
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-400">
                      Sleeve Type
                    </label>
                    <Field
                      as="select"
                      name={`productDetails[${index}].SleeveTypeId`}
                      className="rounded-xl text-gray-400 text-sm p-2 w-full outline-none bg-gray-950 border-1 border-gray-600"
                    >
                      <option value={""}>Select an option</option>
                      {sleeveTypeData?.map((sleeve, index) => (
                        <option key={index} value={sleeve?.id}>
                          {sleeve?.sleeveTypeName}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name={`productDetails[${index}].SleeveTypeId`}
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-400">
                    Client
                  </label>
                  <Field
                    as="select"
                    name={`productDetails[${index}].ClientId`}
                    className="rounded-xl text-gray-400 text-sm p-2 w-full outline-none bg-gray-950 border-1 border-gray-600"
                  >
                    <option value={""}>Select an option</option>
                    {clients?.map((client) => (
                      <option key={client?.Id} value={client?.Id}>
                        {client?.Name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name={`productDetails[${index}].ClientId`}
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-400">
                    Size Measurement
                  </label>
                  <div className="flex gap-1">
                    <Field
                      as="select"
                      name={`productDetails[${index}].ProductSizeMeasurementId`}
                      className="rounded-xl text-gray-400 text-sm p-2 w-full outline-none bg-gray-950 border-1 border-gray-600"
                    >
                      <option value={""}>Select an option</option>
                      {sortedMeasurements.map((sm) => (
                          <option key={sm.Id} value={sm.Id}>
                            {sm.SizeOptionName}
                          </option>
                        ))}
                    </Field>
                    <button
                      type="button"
                      className="bg-green-800 px-3 rounded text-xs flex items-center text-nowrap gap-1"
                    >
                      <FaRegEye size={14} /> Size Chart
                    </button>
                  </div>
                  <ErrorMessage
                    name={`productDetails[${index}].ProductSizeMeasurementId`}
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="flex justify-end items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() =>
                      push({
                        ProductCutOptionId: "",
                        ClientId: "",
                        ProductSizeMeasurementId: "",
                      })
                    }
                  >
                    <FaCirclePlus className="text-green-500 text-lg" />
                  </button>
                  {form.values.productDetails.length > 1 && (
                    <button type="button" onClick={() => remove(index)}>
                      <MdDelete className="text-red-500 text-lg" />
                    </button>
                  )}
                </div>
              </div>
            )})}
          </>
        )}
      </FieldArray>
    </div>
  );
}
