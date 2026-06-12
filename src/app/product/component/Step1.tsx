"use client";

import { useEffect, useState, useRef } from "react";
import { Field, ErrorMessage, FieldArray } from "formik";
import { MdDelete } from "react-icons/md";
import { FaCirclePlus } from "react-icons/fa6";
import useCategoryStore from "@/store/useCategoryStore";
import useFabricStore from "@/store/useFabricStore";
import { Select, SelectItem } from "@heroui/react";
import useColorOptionsStore from "@/store/useColorOptionsStore";
import Label from "../../components/common/Label";
import { useColorPickerStore } from "@/store/useColorPickerStore";
import useClientStore from "@/store/useClientStore";
import useProductComponentTypesStore from "@/store/useProductComponentTypesStore";

export default function Step1({ formik }: any) {
  const [selectedColorOptions, setSelectedColorOptions] = useState<string[]>(
    []
  );
  const prevClientIdRef = useRef<string | number | undefined>(undefined);

  const { fetchCategories, productCategories } = useCategoryStore();
  const { fetchFabricType, fabricTypeData } = useFabricStore();
  const { fetchColorOptions, colorOptions } = useColorOptionsStore();
  const { fetchClients, clients, fetchProjects, projects } = useClientStore();
  const { fetchProductComponentTypes, productComponentTypes } =
    useProductComponentTypesStore();
  const { selectedColors } = useColorPickerStore();

  const handleColorOptionChange = (
    keys:
      | "all"
      | Set<React.Key>
      | (Set<React.Key> & { anchorKey?: string; currentKey?: string })
  ) => {
    if (keys === "all") {
      const allKeys = colorOptions?.map((colorOption) =>
        String(colorOption.Id)
      );
      setSelectedColorOptions(allKeys || []);
      formik.setFieldValue(
        "productColors",
        allKeys.map((colorId, idx) => ({
          Id: idx,
          colorId: Number(colorId),
          ImageId: "1",
        }))
      );
    } else {
      const keyArray = Array.from(keys).map(String);
      setSelectedColorOptions(keyArray);
      formik.setFieldValue(
        "productColors",
        keyArray.map((colorId, idx) => ({
          Id: idx,
          colorId: Number(colorId),
          ImageId: "1",
        }))
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchCategories(),
        fetchFabricType(),
        fetchColorOptions(),
        fetchClients(),
        fetchProductComponentTypes(),
      ]);
    };
    fetchData();
  }, []);

  // Fetch projects when ClientId changes
  useEffect(() => {
    const clientId = formik.values.ClientId;
    const prevClientId = prevClientIdRef.current;
    
    // Only reset ProjectId if ClientId actually changed (not on initial load)
    const clientIdChanged = prevClientId !== undefined && prevClientId !== clientId;
    
    if (clientId && Number(clientId) > 0) {
      fetchProjects(Number(clientId));
    
      if (clientIdChanged) {
        formik.setFieldValue("ProjectId", "");
      }
    } else if (!clientId) {
      formik.setFieldValue("ProjectId", "");
    }
    
    prevClientIdRef.current = clientId;
  }, [formik.values.ClientId]);

  const filteredProjects = projects || [];

  useEffect(() => {
    const colorIds = formik.values.productColors?.map((c: any) =>
      String(c.colorId)
    );
    setSelectedColorOptions(colorIds || []);
  }, [formik.values.productColors]);

  return (
    <div className="space-y-6 w-[500px]">
      <div className="flex flex-col gap-1">
        <Label isRequired={true} label="Product Name" />
        <Field
          type="text"
          name="Name"
          required
          maxLength={255}
          className="rounded-xl dark:text-gray-400 text-gray-800 text-sm p-2 w-full outline-none dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100"
        />
        <ErrorMessage
          name="Name"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label isRequired={true} label="Client" />
        <Field
          as="select"
          name="ClientId"
          required
          className="rounded-xl dark:text-gray-400 text-gray-800 text-sm p-2 w-full outline-none dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100"
        >
          <option value={""}>select a client</option>
          {clients?.map((client, index) => {
            return (
              <option value={client?.Id} key={index}>
                {client?.Name}
              </option>
            );
          })}
        </Field>
        <ErrorMessage
          name="ClientId"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>
        <div className="flex flex-col gap-1">
        <Label isRequired={false} label="Project" />
        <Field
          as="select"
          name="ProjectId"
          disabled={!formik.values.ClientId}
          className="rounded-xl dark:text-gray-400 text-gray-800 text-sm p-2 w-full outline-none dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100"
        >
          <option value={""}>
            {formik.values.ClientId ? "Select a project" : "Select a client first"}
          </option>
          {filteredProjects.map((proj, index) => (
            <option key={index} value={proj.Id}>
              {proj.Name}
            </option>
          ))}
        </Field>
        <ErrorMessage
          name="ProjectId"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label isRequired={true} label="Product Category" />
        <Field
          as="select"
          name="ProductCategoryId"
          required
          className="rounded-xl dark:text-gray-400 text-gray-800 text-sm p-2 w-full outline-none dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100"
        >
          <option value={""}>Select a type</option>
          {productCategories?.map((category, index) => {
            return (
              <option value={category?.Id} key={index}>
                {category?.Type}
              </option>
            );
          })}
        </Field>
        <ErrorMessage
          name="ProductCategoryId"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label isRequired={true} label="Fabric Type" />
        <Field
          as="select"
          name="FabricTypeId"
          required
          className="rounded-xl dark:text-gray-400 text-gray-800 dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100 text-sm p-2 w-full outline-none"
        >
          <option value={""}>Select an option</option>
          {fabricTypeData?.map((category, index) => {
            return (
              <option value={category?.id} key={index}>
                {`${category?.name}_${category?.type}_${category?.gsm}`}
              </option>
            );
          })}
        </Field>
        <ErrorMessage
          name="FabricTypeId"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>
      <FieldArray name="productComponents">
        {({ push, remove, form }) => {
          const productComponents = form.values.productComponents || [];
          const selectedComponentTypeIds = productComponents
            .map((component: any) => String(component?.componentTypeId || ""))
            .filter(Boolean);
          const uniqueSelectedComponentTypeIds = new Set(
            selectedComponentTypeIds
          );
          const addComponentDisabled =
            productComponentTypes.length === 0 ||
            productComponents.length >= productComponentTypes.length ||
            uniqueSelectedComponentTypeIds.size >= productComponentTypes.length;

          return (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Label isRequired={false} label="Component Types" />
                <button
                  type="button"
                  disabled={addComponentDisabled}
                  onClick={() =>
                    push({
                      componentTypeId: "",
                      fabricTypeId: "",
                    })
                  }
                  className={`flex items-center gap-1 text-sm ${
                    addComponentDisabled
                      ? "cursor-not-allowed text-gray-400"
                      : "dark:text-green-400 text-green-700"
                  }`}
                >
                  <FaCirclePlus className="text-base" />
                  Add
                </button>
              </div>
              {productComponents.map((_: any, index: number) => {
                const disabledComponentTypeIds = selectedComponentTypeIds.filter(
                  (id: string) =>
                    id !== String(productComponents[index]?.componentTypeId || "")
                );

                return (
                  <div
                    key={index}
                    className="border-1 dark:border-gray-800 border-gray-400 space-y-3 rounded-lg p-4"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <Label
                          isRequired={false}
                          label="Component Type"
                        />
                        <Field
                          as="select"
                          name={`productComponents[${index}].componentTypeId`}
                          className="rounded-xl dark:text-gray-400 text-gray-800 dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100 text-sm p-2 w-full outline-none"
                        >
                          <option value={""}>Select Component Types</option>
                          {productComponentTypes?.map((type) => (
                            <option
                              key={type.id}
                              value={type.id}
                              disabled={disabledComponentTypeIds.includes(
                                String(type.id)
                              )}
                            >
                              {type.name}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name={`productComponents[${index}].componentTypeId`}
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <Label isRequired={false} label="Fabric Type" />
                        <Field
                          as="select"
                          name={`productComponents[${index}].fabricTypeId`}
                          className="rounded-xl dark:text-gray-400 text-gray-800 dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100 text-sm p-2 w-full outline-none"
                        >
                          <option value={""}>Select an option</option>
                          {fabricTypeData?.map((fabric) => (
                            <option key={fabric.id} value={fabric.id}>
                              {`${fabric?.name}_${fabric?.type}_${fabric?.gsm}`}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name={`productComponents[${index}].fabricTypeId`}
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    </div>

                    {productComponents.length > 1 && (
                      <div className="flex justify-end">
                        <button type="button" onClick={() => remove(index)}>
                          <MdDelete className="text-red-500 text-lg" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
              <ErrorMessage name="productComponents">
                {(message) =>
                  typeof message === "string" ? (
                    <div className="text-red-500 text-sm">{message}</div>
                  ) : null
                }
              </ErrorMessage>
            </div>
          );
        }}
      </FieldArray>
      <div className="flex flex-col gap-1">
        <Label isRequired={false} label="Available Colors" />
        <Select
          className="rounded-xl text-gray-400 text-sm w-full outline-none dark:bg-slate-800 bg-gray-100 "
          name="ColorName"
          placeholder="Select Color Options"
          variant="bordered"
          selectionMode="multiple"
          aria-label="printing option"
          selectedKeys={new Set(selectedColorOptions)}
          onSelectionChange={(keys) => handleColorOptionChange(keys)}
        >
          {colorOptions!.map((colorOptions) => (
            <SelectItem key={colorOptions?.Id}>{colorOptions.Name}</SelectItem>
          ))}
        </Select>
      </div>
      {/* <div className="flex items-center justify-center gap-4 mt-3">
        <span className=" text-center dark:text-gray-400 text-gray-800 text-sm">
          Or Choose a Cutom Color
        </span>
        <button
          type="button"
          onClick={() => setIsColorModalOpen(true)}
          className="bg-green-800 p-1 rounded text-white"
        >
          Choose
        </button>
      </div> */}
      <div className="grid grid-cols-3 gap-2">
        {selectedColors?.map((color, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded border shadow-inner"
              style={{ backgroundColor: color.hex }}
            />
            <div className="text-sm text-gray-500 truncate">
              <strong>{color.name}</strong>
            </div>
          </div>
        ))}
      </div>
      {/* <ColorPickerModal
        isOpen={isColorModalOpen}
        closeAddModal={handleCloseColorModal}
        onSaveColors={handleSaveCustomColors}
      /> */}
    </div>
  );
}
