"use client";

import { useEffect, useState, useRef } from "react";
import { Field, ErrorMessage } from "formik";
import useCategoryStore from "@/store/useCategoryStore";
import useFabricStore from "@/store/useFabricStore";
import { Select, SelectItem } from "@heroui/react";
import useColorOptionsStore from "@/store/useColorOptionsStore";
import Label from "../../components/common/Label";
import { useColorPickerStore } from "@/store/useColorPickerStore";
import useClientStore from "@/store/useClientStore";
import { FileText } from "lucide-react";

// Reuse the same base field/dropdown style as order form (Target Delivery Date)
const fieldStyle =
  "w-full bg-slate-800 text-white text-sm px-4 py-3 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500";
const selectStyle = fieldStyle + " cursor-pointer";

export default function Step1({ formik }: any) {
  const [selectedColorOptions, setSelectedColorOptions] = useState<string[]>(
    []
  );
  const prevClientIdRef = useRef<string | number | undefined>(undefined);

  const { fetchCategories, productCategories } = useCategoryStore();
  const { fetchFabricType, fabricTypeData } = useFabricStore();
  const { fetchColorOptions, colorOptions } = useColorOptionsStore();
  const { fetchClients, clients, fetchProjects, projects } = useClientStore();
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
    <div className="space-y-6 w-full max-w-2xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Basic Information</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Enter the core product details
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Label isRequired={true} label="Product Name" />
        <Field
          type="text"
          name="Name"
          required
          className={fieldStyle}
        />
        <ErrorMessage
          name="Name"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <Label isRequired={true} label="Client" />
          <Field
            as="select"
            name="ClientId"
            required
            className={selectStyle}
          >
            <option value={""}>Select a client</option>
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
            className={selectStyle}
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
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <Label isRequired={true} label="Product Category" />
          <Field
            as="select"
            name="ProductCategoryId"
            required
            className={selectStyle}
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
            className={selectStyle}
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
      </div>
      <div className="flex flex-col gap-1">
        <Label isRequired={false} label="Available Colors" />
        <Select
          className="w-full"
          classNames={{
            trigger:
              "bg-slate-800 text-white text-sm px-4 py-3 rounded-lg border border-slate-700 data-[hover=true]:bg-slate-700",
            value:
              "text-white !text-white",
            innerWrapper:
              "text-white [&_*]:!text-white [&_.text-default-500]:!text-white",
            label: "text-slate-400",
            popoverContent: "bg-slate-900 text-slate-100",
          }}
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
            <div className="text-sm text-slate-400 truncate">
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
