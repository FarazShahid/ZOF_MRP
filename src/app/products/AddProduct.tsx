import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Spinner,
} from "@heroui/react";
import { FaCirclePlus } from "react-icons/fa6";
import { Field, Formik, Form, ErrorMessage, FieldArray } from "formik";
import useCategoryStore from "@/store/useCategoryStore";
import useFabricStore from "@/store/useFabricStore";
import useProductStore from "@/store/useProductStore";
import { ProductSchema } from "../schema/ProductSchema";
import useColorOptionsStore from "@/store/useColorOptionsStore";
import { MdDelete } from "react-icons/md";
import useCutOptionsStore from "@/store/useCutOptionsStore";
import useSizeOptionsStore from "@/store/useSizeOptionsStore";
import useProductRegionStore from "@/store/useProductRegionStore";
import useSleeveType from "@/store/useSleeveType";
import {
  GetSizeOptionsResponse,
  SizeMeasurements,
} from "@/store/useSizeMeasurementsStore";
import useClientStore from "@/store/useClientStore";
import { fetchWithAuth } from "../services/authservice";
import toast from "react-hot-toast";

interface AddClientComponentProps {
  isOpen: boolean;
  isEdit: boolean;
  productId: number;
  closeAddModal: () => void;
}
interface ColorOptions {
  colorId: number | null;
  ImageId: string;
}
interface productDetailsType {
  ProductCutOptionId: number | null;
  ProductSizeMeasurementId: number | null;
  ProductRegionId: number | null;
  SleeveTypeId: number | null;
  ClientId?: number | null;
}

const AddProduct: React.FC<AddClientComponentProps> = ({
  isOpen,
  closeAddModal,
  isEdit,
  productId,
}) => {
  interface AddProduct {
    ProductCategoryId: number;
    FabricTypeId: number;
    Name: string;
    productColors: ColorOptions[];
    productDetails: productDetailsType[];
    Description: string;
    CreatedBy: string;
    UpdatedBy: string;
  }

  const { addProduct, getProductById, updateProduct, productById, loading } =
    useProductStore();
  const { fetchCategories, productCategories } = useCategoryStore();
  const { fetchFabricType, fabricTypeData } = useFabricStore();
  const { colorOptions, fetchColorOptions } = useColorOptionsStore();
  const { fetchcutOptions, cutOptions } = useCutOptionsStore();
  const { fetchsizeOptions, sizeOptions } = useSizeOptionsStore();
  const { fetchProductRegions, productRegions } = useProductRegionStore();
  const { fetchSleeveType, sleeveTypeData } = useSleeveType();
  const { fetchClients, clients } = useClientStore();

  const [measurementsMap, setMeasurementsMap] = useState<
    Record<number, SizeMeasurements[]>
  >({});
  const [allMeasurements, setAllMeasurements] = useState<SizeMeasurements[]>(
    []
  );
  const [selectedColorOptions, setSelectedColorOptions] = useState<string[]>(
    []
  );

  useEffect(() => {
    if (productId && isEdit) {
      getProductById(productId);
    }
  }, [productId, isEdit]);

  useEffect(() => {
    if (isEdit && productById?.productColors) {
      const selectedColors = productById.productColors.map((color) =>
        String(color.colorId)
      );
      setSelectedColorOptions(selectedColors);
    }
  }, [isEdit, productById]);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchCategories(),
        fetchFabricType(),
        fetchColorOptions(),
        fetchcutOptions(),
        fetchsizeOptions(),
        fetchProductRegions(),
        fetchSleeveType(),
      ]);
    };
    fetchData();
  }, []);

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
    } else {
      const keyArray = Array.from(keys).map(String);
      setSelectedColorOptions(keyArray);
    }
  };

  const InitialValues: AddProduct = {
    Name: isEdit && productById ? productById?.Name : "",
    ProductCategoryId:
      isEdit && productById ? Number(productById?.ProductCategoryId) : 0,
    FabricTypeId: isEdit && productById ? Number(productById?.FabricTypeId) : 0,
    productColors:
      isEdit && productById
        ? productById?.productColors?.map((color) => ({
            colorId: color?.colorId,
            ImageId: color?.ImageId || "",
          }))
        : [],
    productDetails:
      isEdit && productById
        ? productById?.productDetails?.map((detail) => ({
            ProductCutOptionId: detail?.ProductCutOptionId,
            ProductSizeMeasurementId: detail?.ProductSizeMeasurementId,
            ProductRegionId: detail?.ProductRegionId,
            SleeveTypeId: detail?.SleeveTypeId,
          }))
        : [
            {
              ProductCutOptionId: null,
              ProductSizeMeasurementId: null,
              ProductRegionId: null,
              SleeveTypeId: null,
            },
          ],
    Description: isEdit && productById ? productById?.Description : "",
    CreatedBy: isEdit && productById ? productById?.CreatedBy : "Admin",
    UpdatedBy: isEdit && productById ? productById?.UpdatedBy : "Admin",
  };

  const handleAddProduct = async (values: AddProduct) => {
    const updatedValues = {
      ...values,
      productColors: selectedColorOptions?.map((colorId) => ({
        colorId: Number(colorId),
        ImageId: "1",
      })),
    };

    isEdit
      ? updateProduct(productId, updatedValues, () => {
          closeAddModal();
        })
      : addProduct(updatedValues, () => {
          closeAddModal();
        });
  };

  const handleClientChange = async (clientId: number, index: number) => {
    if (clientId) {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/size-measurements/by-client/${clientId}`
      );
      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || "Failed to fetch data");
        return;
      }
      const data: GetSizeOptionsResponse = await response.json();
      setMeasurementsMap((prev) => ({
        ...prev,
        [index]: data.data,
      }));
    } else {
      setMeasurementsMap((prev) => ({
        ...prev,
        [index]: [],
      }));
    }
  };

  const fetchSizeMeasurements = async () => {
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/size-measurements`
      );
      if (!response.ok) {
        toast.error("Error Fetching Data");
      }
      const data: GetSizeOptionsResponse = await response.json();
      setAllMeasurements(data.data);
    } catch (error) {
      toast.error("Error Fetching Data");
    }
  };

  useEffect(() => {
    if (productId && isEdit) {
      getProductById(productId);
    }
  }, [productId, isEdit]);


  useEffect(() => {
    if (isEdit && productById?.productColors) {
      const selectedColors = productById.productColors.map((color) =>
        String(color.colorId)
      );
      setSelectedColorOptions(selectedColors);
    }
  }, [isEdit, productById]);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchCategories(),
        fetchFabricType(),
        fetchColorOptions(),
        fetchcutOptions(),
        fetchSizeMeasurements(),
        fetchSleeveType(),
        fetchClients(),
      ]);
    };
    fetchData();
  }, []);

  return (
    <Modal isOpen={isOpen} size="5xl" onOpenChange={closeAddModal}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {!isEdit ? <> Add Product</> : <> Edit Product</>}
            </ModalHeader>
            <Formik
              validationSchema={ProductSchema}
              initialValues={InitialValues}
              enableReinitialize
              onSubmit={handleAddProduct}
            >
              {({ isSubmitting, values }) => (
                <Form>
                  <ModalBody>
                    {loading ? (
                      <Spinner />
                    ) : (
                      <>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-600 font-sans">
                              Product Category
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              name="ProductCategoryId"
                              as="select"
                              className="formInputdefault"
                            >
                              <option value={""}>Select a type</option>
                              {productCategories.map((category) => {
                                return (
                                  <option value={category.id}>
                                    {category.type}
                                  </option>
                                );
                              })}
                            </Field>
                            <ErrorMessage
                              name="ProductCategoryId"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-600 font-sans">
                              Fabric Type
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              name="FabricTypeId"
                              as="select"
                              className="formInputdefault"
                            >
                              <option value={""}>Select a type</option>
                              {fabricTypeData.map((category) => {
                                return (
                                  <option value={category.id}>
                                    {`${category.name}_${category.type}_${category.gsm}`}
                                  </option>
                                );
                              })}
                            </Field>
                            <ErrorMessage
                              name="FabricTypeId"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-600 font-sans">
                              Color
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Select
                              className="max-w-xs"
                              name="ColorName"
                              placeholder="Select Color Options"
                              selectionMode="multiple"
                              aria-label="printing option"
                              selectedKeys={new Set(selectedColorOptions)}
                              onSelectionChange={(keys) =>
                                handleColorOptionChange(keys)
                              }
                            >
                              {colorOptions!.map((colorOptions) => (
                                <SelectItem key={colorOptions?.Id}>
                                  {colorOptions.Name}
                                </SelectItem>
                              ))}
                            </Select>
                            <ErrorMessage
                              name="ColorName"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                        </div>
                        <FieldArray name="productDetails">
                          {({ push, remove }) => (
                            <div className="flex flex-col gap-3">
                              {values.productDetails.map((_, index) => (
                                <div
                                  key={index}
                                  className="flex flex-col gap-1 bg-gray-50 p-3 rounded-md border border-gray-300"
                                >
                                  <div className="grid grid-cols-4 gap-3">
                                    {/* Cut Option */}
                                    <div className="flex flex-col gap-1">
                                      <label className="text-sm text-gray-600 font-sans">
                                        Cut Option
                                      </label>
                                      <Field
                                        as="select"
                                        name={`productDetails[${index}].ProductCutOptionId`}
                                        className="formInputdefault"
                                      >
                                        <option value="">
                                          Select an option
                                        </option>
                                        {cutOptions.map((cutOption) => (
                                          <option
                                            key={cutOption.Id}
                                            value={cutOption.Id}
                                          >
                                            {cutOption.OptionProductCutOptions}
                                          </option>
                                        ))}
                                      </Field>
                                    </div>
                                    {/* Clients */}
                                    <div className="flex flex-col gap-1">
                                      <label className="text-sm text-gray-600 font-sans">
                                        Client
                                      </label>
                                      <Field
                                        as="select"
                                        name={`productDetails[${index}].ClientId`}
                                        className="formInputdefault"
                                        onChange={(e: {
                                          target: { value: any };
                                        }) =>
                                          handleClientChange(
                                            Number(e.target.value),
                                            index
                                          )
                                        }
                                      >
                                        <option value="">
                                          Select a client
                                        </option>
                                        {clients.map((client) => (
                                          <option
                                            key={client.Id}
                                            value={client.Id}
                                          >
                                            {client.Name}
                                          </option>
                                        ))}
                                      </Field>
                                    </div>

                                    {/* Size Measurement */}
                                    <div className="flex flex-col gap-1">
                                      <label className="text-sm text-gray-600 font-sans">
                                        Size Measurement
                                      </label>
                                      <Field
                                        as="select"
                                        name={`productDetails[${index}].ProductSizeMeasurementId`}
                                        className="formInputdefault"
                                      >
                                        <option value="">
                                          Select an option
                                        </option>
                                        {(
                                          measurementsMap[index] ??
                                          allMeasurements
                                        ).map((sizeMeasurement) => (
                                          <option
                                            key={sizeMeasurement.Id}
                                            value={sizeMeasurement.Id}
                                          >
                                            {sizeMeasurement.Measurement1}
                                          </option>
                                        ))}
                                      </Field>
                                    </div>

                                    {/* Sleeve Type */}
                                    <div className="flex flex-col gap-1">
                                      <label className="text-sm text-gray-600 font-sans">
                                        Sleeve Type
                                      </label>
                                      <Field
                                        as="select"
                                        name={`productDetails[${index}].SleeveTypeId`}
                                        className="formInputdefault"
                                      >
                                        <option value="">
                                          Select an option
                                        </option>
                                        {sleeveTypeData.map((sleeve) => (
                                          <option
                                            key={sleeve.id}
                                            value={sleeve.id}
                                          >
                                            {sleeve.sleeveTypeName}
                                          </option>
                                        ))}
                                      </Field>
                                    </div>
                                  </div>

                                  {/* Add / Delete Buttons */}
                                  <div className="flex justify-end items-center gap-2 mt-2">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        push({
                                          ProductCutOptionId: "",
                                          ProductSizeMeasurementId: "",
                                          ProductRegionId: "",
                                          SleeveTypeId: "",
                                        })
                                      }
                                    >
                                      <FaCirclePlus className="hover:text-green-500 text-lg" />
                                    </button>

                                    {index > 0 && (
                                      <button
                                        type="button"
                                        onClick={() => remove(index)}
                                      >
                                        <MdDelete className="hover:text-red-500 text-lg" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </FieldArray>
                        <div className="flex flex-col gap-1 w-full">
                          <label className="text-sm text-gray-600 font-sans">
                            Description
                            <span className="text-red-500 text-sm">*</span>
                          </label>
                          <Field
                            name="Description"
                            as="textarea"
                            placeholder="Description"
                            rows={4}
                            className="formInputdefault !h-auto"
                          />
                          <ErrorMessage
                            name="Description"
                            component="div"
                            className="text-red-400 text-sm"
                          />
                        </div>
                      </>
                    )}
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="danger"
                      variant="flat"
                      onPress={closeAddModal}
                    >
                      Cancel
                    </Button>
                    <Button
                      isLoading={isSubmitting}
                      color="primary"
                      type="submit"
                    >
                      {isEdit ? "Edit" : "Add"} Product
                    </Button>
                  </ModalFooter>
                </Form>
              )}
            </Formik>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AddProduct;
