"use client";

import { useEffect, useState } from "react";
import { Field, ErrorMessage } from "formik";
import useCategoryStore from "@/store/useCategoryStore";
import useFabricStore from "@/store/useFabricStore";
import { Select, SelectItem } from "@heroui/react";
import useColorOptionsStore from "@/store/useColorOptionsStore";
import ColorPickerModal from "./ColorPickerModal";
import Label from "../../components/common/Label";
import { useColorPickerStore } from "@/store/useColorPickerStore";

export default function Step1({ formik }: any) {
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [selectedColorOptions, setSelectedColorOptions] = useState<string[]>(
    []
  );
  

  const { fetchCategories, productCategories } = useCategoryStore();
  const { fetchFabricType, fabricTypeData } = useFabricStore();
  const { fetchColorOptions, colorOptions } = useColorOptionsStore();
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

  const handleCloseColorModal = () => {
    setIsColorModalOpen(false);
  };

  const handleSaveCustomColors = (colors: { name: string; hex: string }[]) => {
    setIsColorModalOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchCategories(),
        fetchFabricType(),
        fetchColorOptions(),
      ]);
    };
    fetchData();
  }, []);


  return (
    <div className="space-y-6 w-[500px]">
      <div className="flex flex-col gap-1">
        <Label isRequired={true} label="Product Name" />
        <Field
          type="text"
          name="Name"
          className="rounded-xl dark:text-gray-400 text-gray-800 text-sm p-2 w-full outline-none dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100"
        />
        <ErrorMessage
          name="Name"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label isRequired={true} label="Product Category" />
        <Field
          as="select"
          name="ProductCategoryId"
          className="rounded-xl dark:text-gray-400 text-gray-800 text-sm p-2 w-full outline-none dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100"
        >
          <option value={""}>Select a type</option>
          {productCategories?.map((category, index) => {
            return (
              <option value={category?.id} key={index}>
                {category?.type}
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
