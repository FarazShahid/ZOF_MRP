import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Autocomplete,
  AutocompleteItem,
  Chip,
  Select,
  SelectItem,
  Input,
} from "@nextui-org/react";
import { MdDeleteOutline } from "react-icons/md";
import { Field, Form, Formik } from "formik";

import useClientEvents from "../services/useClientEvents";
import { useOrderStatus } from "../services/useOrderStatus";
import { OrderSchemaValidation } from "../schema/OrderSchema";
import { Product, useFetchProducts } from "../services/useFetchProducts";
import { AvailableColor, formatedProductName } from "../interfaces";
import { fetchWithAuth } from "../services/authservice";
import { useFetchPrintingOptions } from "../services/useFetchPrintingOptions";

interface AddOrderComponentProps {
  isOpen: boolean;
  clientId: string;
  onClose: () => void;
  onOrderAdded: () => void;
}

const AddOrderComponent: React.FC<AddOrderComponentProps> = ({
  isOpen,
  onClose,
  clientId,
  onOrderAdded,
}) => {
  const [value, setValue] = useState<string>("");
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [availableColors, setAvailableColors] = useState<AvailableColor[]>([]);
  const [selectedPrintingOptions, setSelectedPrintingOptions] = useState<number[] | undefined>([]);

  const { events } = useClientEvents();
  const { statuses } = useOrderStatus();
  const { products } = useFetchProducts();
  const { printingoptions } = useFetchPrintingOptions();

  const onSelectionChange = (key: React.Key | null) => {
    if (key && products) {
      const selectedItem = products.find(
        (product) => product.Id === Number(key)
      );

      if (
        selectedItem &&
        !selectedProducts.some((p) => p.Id === selectedItem.Id)
      ) {
        setSelectedProducts([...selectedProducts, selectedItem]);
      }
      if (selectedItem?.Id) {
        fetchProductAvialableColors(selectedItem?.Id);
      }
    }
  };
  const fetchProductAvialableColors = async (productId: number) => {
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/products/availablecolors/${productId}`
      );
      if (response.ok) {
        const colors = await response.json();
        setAvailableColors(colors);
      } else {
        setAvailableColors([]);
      }
    } catch (error) {
      console.error("Error fetching colors:", error);
      setAvailableColors([]);
    }
  };

  const onInputChange = (value: string) => {
    setValue(value);
  };

  const onDeleteProduct = (id: number) => {
    setSelectedProducts(
      selectedProducts.filter((product) => product.Id !== id)
    );
  };

  const handleModalClose = () => {
    setSelectedProducts([]);
    onClose();
  };

  const handlePrintingOptionChange  = (
    keys: "all" | (Set<React.Key> & { anchorKey?: string; currentKey?: string })
  ) => {
    if (keys === "all") {
      const allKeys = printingoptions?.map((printingoptions) => printingoptions.Id);
      setSelectedPrintingOptions(allKeys);
    } else {
      const keyArray = Array.from(keys) as number[];
      setSelectedPrintingOptions(keyArray);
    }
  };

  const OrderInitialValues = {
    OrderEventId: "",
    OrderStatusId: "",
    Deadline: "",
    Description: "",
  };

  const handleAddOrder = async (values: any) => {
    const orderPayload = {
      ClientId: clientId,
      OrderEventId: values.OrderEventId,
      Description: values.Description,
      OrderStatusId: values.OrderStatusId,
      Deadline: values.Deadline,
      items: selectedProducts.map((product) => {
        return {
          ProductId: product.Id, 
          Description: "",
          ImageId: 0,
          FileId: 0,
          VideoId: 0,
          printingoptions: selectedPrintingOptions?.map((option) => {
            return {
              PrintingOptionId: option,
              Description:"",
            }
          })
        };
      })
    }
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderPayload),
        }
      );

      if (!response.ok) {
        console.log("Error creating order");
        throw new Error("Failed to create order");
      }
      const result = await response.json();
      handleModalClose();
      onOrderAdded();
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };


  return (
    <Modal isOpen={isOpen} size="4xl" onOpenChange={handleModalClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Add New Order - {clientId}
            </ModalHeader>
            <Formik
              validationSchema={OrderSchemaValidation}
              initialValues={OrderInitialValues}
              onSubmit={handleAddOrder}
            >
              {({ values, setFieldValue, isSubmitting }) => (
                <Form>
                  <ModalBody>
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-5 formContainerWrapper rounded-lg p-3">
                        <h6 className="text-lg font-medium">Order Details</h6>
                        <div className="flex flex-col gap-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            <div className="flex flex-col gap-1">
                              <label className="font-medium text-sm text-[#181818]">
                                Order Name
                              </label>
                              <Field
                                name="orderName"
                                className="formInputdefault"
                                type="text"
                                placeholder="Enter Order Name"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="font-medium text-sm text-[#181818]">
                                Order Event
                              </label>
                              <Field
                                as="select"
                                name="OrderEventId"
                                className="formInputdefault"
                              >
                                <option value="">Select an event</option>
                                {events.map((event) => (
                                  <option key={event.Id} value={event.Id}>
                                    {event.EventName}
                                  </option>
                                ))}
                              </Field>
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="font-medium text-sm text-[#181818]">
                                Order Status
                              </label>
                              <Field
                                as="select"
                                name="OrderStatusId"
                                className="formInputdefault"
                              >
                                <option value="">Select a status</option>
                                {statuses.map((statu) => (
                                  <option key={statu.Id} value={statu.Id}>
                                    {statu.StatusName}
                                  </option>
                                ))}
                              </Field>
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="font-medium text-sm text-[#181818]">
                                Deadline
                              </label>
                              <Field
                                name="Deadline"
                                type="date"
                                className="formInputdefault"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="font-medium text-sm text-[#181818]">
                              Description
                            </label>
                            <Field
                              as="textarea"
                              name="Description"
                              className="formInputdefault !h-auto"
                              rows={4}
                              placeholder="Enter description"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-5 formContainerWrapper rounded-lg p-3">
                        <div className="flex items-center gap-1">
                          <h6 className="text-lg font-medium">Order Items</h6>
                          {selectedProducts.length > 0 ? (
                            <Chip variant="flat" size="sm" color="success">
                              {selectedProducts.length}
                            </Chip>
                          ) : (
                            <></>
                          )}
                        </div>
                        <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                          <Autocomplete
                            scrollShadowProps={{
                              isEnabled: false,
                            }}
                            defaultItems={products || []}
                            itemHeight={40}
                            variant="bordered"
                            label="Product Catagory"
                            labelPlacement="outside"
                            maxListboxHeight={200}
                            placeholder="Search Product..."
                            onInputChange={onInputChange}
                            onSelectionChange={onSelectionChange}
                          >
                            {(product) => (
                              <AutocompleteItem key={product.Id}>
                                {formatedProductName(
                                  product.FabricTypeName,
                                  product.FabricName,
                                  product.FabricGSM,
                                  product.ProductCategoryName
                                )}
                              </AutocompleteItem>
                            )}
                          </Autocomplete>
                        </div>
                        {selectedProducts.length > 0 && (
                          <div className="overflow-x-auto">
                            <table className="min-w-full border-separate [border-spacing:0_0.5em]">
                              <thead className=" text-black bg-gray-200 text-sm text-center">
                                <tr>
                                  <th>Product</th>
                                  <th>Color</th>
                                  <th>Qunatity</th>
                                  <th>Printing Options</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedProducts.map((product) => (
                                  <tr
                                    key={product.Id}
                                    className="border-t cursor-pointer text-center"
                                  >
                                    <td className="text-center">
                                      {formatedProductName(
                                        product.FabricTypeName,
                                        product.FabricName,
                                        product.FabricGSM,
                                        product.ProductCategoryName
                                      )}
                                    </td>
                                    <td>
                                      <Select
                                        className="max-w-xs"
                                        placeholder="Select Color"
                                        selectionMode="single"
                                        aria-label="color option"
                                      >
                                        {availableColors.map((color) => (
                                          <SelectItem key={color.Id}>
                                            {color.ColorName}
                                          </SelectItem>
                                        ))}
                                      </Select>
                                    </td>
                                    <td>
                                      <div className="flex justify-center items-center">
                                        <Input type="number" className="w-[50%] " />
                                      </div>
                                    </td>
                                    <td>
                                      <Select
                                        className="max-w-xs"
                                        placeholder="Select Printing options"
                                        selectionMode="multiple"
                                        aria-label="printing option"
                                        onSelectionChange={handlePrintingOptionChange}
                                      >
                                        {printingoptions!.map((printingOption) => (
                                          <SelectItem key={printingOption?.Id}>
                                            {printingOption.Type}
                                          </SelectItem>
                                        ))}
                                      </Select>
                                    </td>
                                    <td>
                                      <button
                                        onClick={() =>
                                          onDeleteProduct(product.Id)
                                        }
                                        className="cursor-pointer"
                                      >
                                        <MdDeleteOutline color="red" size={18} />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="danger"
                      variant="flat"
                      isLoading={isSubmitting}
                      onPress={handleModalClose}
                    >
                      Cancel
                    </Button>
                    <Button color="primary" type="submit">
                      Add Order
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

export default AddOrderComponent;
