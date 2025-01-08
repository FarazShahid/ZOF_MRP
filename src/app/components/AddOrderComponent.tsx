import { useEffect, useState } from "react";
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
  Accordion,
  AccordionItem,
} from "@nextui-org/react";
import { MdDeleteOutline } from "react-icons/md";
import { Field, Form, Formik } from "formik";

import useClientEvents from "../services/useClientEvents";
import { useOrderStatus } from "../services/useOrderStatus";
import { OrderSchemaValidation } from "../schema/OrderSchema";
import { useFetchProducts } from "../services/useFetchProducts";
import {
  AvailableColor,
  formatedProductName,
  OrderItemType,
  AddOrderComponentProps,
  getProductNameById,
} from "../interfaces";
import { fetchWithAuth } from "../services/authservice";
import { useFetchPrintingOptions } from "../services/useFetchPrintingOptions";
import { useOrderDetails } from "../services/useOrderDetails";

const AddOrderComponent: React.FC<AddOrderComponentProps> = ({
  isOpen,
  onClose,
  clientId,
  isEditOrder,
  orderId,
  refreshKey,
  onOrderAdded,
}) => {
  const [value, setValue] = useState<string>("");
  const [selectedProducts, setSelectedProducts] = useState<OrderItemType[]>([]);
  const [availableColors, setAvailableColors] = useState<AvailableColor[]>([]);
  const [selectedPrintingOptions, setSelectedPrintingOptions] = useState<
    number[] | undefined
  >([]);

  const { orderDetails, refetch, isLoading } = useOrderDetails(orderId);
  const { events } = useClientEvents();
  const { statuses } = useOrderStatus();
  const { products } = useFetchProducts();
  const { printingoptions } = useFetchPrintingOptions();

  const onSelectionChange = (key: React.Key | null) => {
    if (key && products) {
      const selectedItem = products.find(
        (product) => product.Id === Number(key)
      );

      if (selectedItem) {
        const productExists = selectedProducts.some(
          (product) => product.ProductId === selectedItem.Id
        );

        if (!productExists) {
          const newProduct: OrderItemType = {
            ProductId: selectedItem.Id,
            Description: "",
            OrderItemPriority: 0,
            ColorOptionId: 0,
            OrderItemQuantity: 0,
            Name: selectedItem.Name,
            ImageId: 0,
            FileId: 0,
            VideoId: 0,
            printingOptions: [],
          };

          setSelectedProducts([...selectedProducts, newProduct]);
        }
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
      selectedProducts.filter((product) => product.ProductId !== id)
    );
  };

  const handleModalClose = () => {
    setSelectedProducts([]);
    onClose();
  };

  const handleColorChange = (
    keys: "all" | Set<React.Key>,
    productId: number
  ) => {
    if (keys === "all") {
      return;
    }
    const selectedColorId = Array.from(keys)[0] as number;
    setSelectedProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.ProductId === productId
          ? { ...product, ColorOptionId: selectedColorId }
          : product
      )
    );
  };

  const handleDescriptionChange = (
    productId: number,
    newDescription: string
  ) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.ProductId === productId
          ? { ...product, Description: newDescription }
          : product
      )
    );
  };

  const handlePrintingOptionChange = (
    keys:
      | "all"
      | Set<React.Key>
      | (Set<React.Key> & { anchorKey?: string; currentKey?: string }),
    productId: number
  ) => {
    if (keys === "all") {
      const allKeys = printingoptions?.map(
        (printingOption) => printingOption.Id
      );
      setSelectedPrintingOptions(allKeys);
    } else {
      const keyArray = Array.from(keys) as number[];
      setSelectedProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.ProductId === productId
            ? {
                ...product,
                printingOptions: keyArray.map((optionId) => ({
                  PrintingOptionId: optionId,
                  Description: "",
                })),
              }
            : product
        )
      );

      setSelectedPrintingOptions(keyArray);
    }
  };

  const handlePriorityChange = (productId: number, newPriority: number) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.ProductId === productId
          ? { ...product, OrderItemPriority: newPriority }
          : product
      )
    );
  };

  const OrderInitialValues = isEditOrder
    ? {
        OrderEventId: orderDetails?.OrderEventId || "",
        OrderStatusId: orderDetails?.OrderStatusId || "",
        Deadline: orderDetails?.Deadline
          ? new Date(orderDetails.Deadline).toISOString().split("T")[0]
          : "",
        Description: orderDetails?.Description || "",
        OrderPriority: orderDetails?.OrderPriority || "",
        OrderName: orderDetails?.OrderName || "",
      }
    : {
        OrderEventId: "",
        OrderStatusId: "",
        Deadline: "",
        Description: "",
        OrderPriority: "",
      };

  const handleAddOrder = async (values: any) => {
    const Method = isEditOrder ? "PUT" : "POST";
    const URL = isEditOrder
      ? `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`
      : `${process.env.NEXT_PUBLIC_API_URL}/orders`;
    const orderPayload = {
      ClientId: clientId,
      OrderEventId: values.OrderEventId,
      Description: values.Description,
      OrderStatusId: values.OrderStatusId,
      Deadline: values.Deadline,
      OrderNumber: "",
      OrderName:  values.OrderName,
      OrderPriority: values.OrderPriority,
      ExternalOrderId: 1,
      items: selectedProducts.map((product) => {
        return {
          ProductId: product.ProductId,
          Description: product.Description,
          OrderItemPriority: product.OrderItemPriority,
          ColorOptionId: product.ColorOptionId,
          OrderItemQuantity: product.OrderItemQuantity,
          ImageId: product.ImageId,
          FileId: product.FileId,
          VideoId: product.VideoId,
          printingOptions: product.printingOptions.map((option) => {
            return {
              PrintingOptionId: option.PrintingOptionId,
              Description: option.Description,
            };
          }),
        };
      }),
    };
    try {
      const response = await fetchWithAuth(URL, {
        method: Method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

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

  useEffect(() => {
    if (isEditOrder && isOpen) {
      refetch();
    }
  }, [isEditOrder, isOpen, refetch]);

  useEffect(() => {
    if (isEditOrder && orderId && orderDetails) {
      const formattedItems = orderDetails.items.map((item) => ({
        ProductId: item.ProductId,
        Description: item.Description || "",
        OrderItemPriority: item.OrderItemPriority || 0,
        ColorOptionId: item.ColorOptionId || 0,
        OrderItemQuantity: item.OrderItemQuantity || 0,
        Name: "",
        ImageId: item.ImageId || 0,
        FileId: item.FileId || 0,
        VideoId: item.VideoId || 0,
        printingOptions: item.printingOptions || [],
      }));
      setSelectedProducts(formattedItems);
    } else {
      setSelectedProducts([]);
    }
  }, [isEditOrder, orderId, orderDetails, isOpen]);

  return (
    <Modal isOpen={isOpen} size="4xl" onOpenChange={handleModalClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {!isEditOrder ? <>Add New Order</> : <>Edit Order</>}
            </ModalHeader>
            <Formik
              validationSchema={OrderSchemaValidation}
              initialValues={OrderInitialValues}
              enableReinitialize
              onSubmit={handleAddOrder}
            >
              {({ values, setFieldValue, isSubmitting }) => (
                <Form>
                  <ModalBody>
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-5 formContainerWrapper rounded-lg p-3">
                        <h6 className="text-lg font-medium">Order Details</h6>
                        <div className="flex flex-col gap-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            <div className="flex flex-col gap-1">
                              <label className="font-medium text-sm text-[#181818]">
                                Order Name
                              </label>
                              <Field
                                name="OrderName"
                                type="text"
                                className="formInputdefault"
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
                            <div className="flex flex-col gap-1">
                              <label className="font-medium text-sm text-[#181818]">
                                Order Priority
                              </label>
                              <Field
                                name="OrderPriority"
                                type="number"
                                className="formInputdefault"
                                min={0}
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
                                {product.Name}
                              </AutocompleteItem>
                            )}
                          </Autocomplete>
                        </div>

                        <Accordion variant="splitted">
                          {selectedProducts.map((product) => (
                            <AccordionItem
                              key={product.ProductId}
                              aria-label={`accordion-${product.ProductId}`}
                              title={
                                isEditOrder
                                  ? getProductNameById(
                                      products,
                                      product.ProductId
                                    )
                                  : product.Name
                              }
                            >
                              <div className="flex flex-col gap-2 mb-2">
                                <div className="flex items-center justify-end">
                                  <button
                                    className="cursor-pointer"
                                    onClick={() =>
                                      onDeleteProduct(product.ProductId)
                                    }
                                  >
                                    <MdDeleteOutline color="red" size={18} />
                                  </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                  <div className="flex flex-col gap-1">
                                    <label className="text-sm text-gray-500 font-sans">
                                      Aavailable Colors
                                    </label>
                                    <Select
                                      className="max-w-xs"
                                      placeholder="Select Color"
                                      selectionMode="single"
                                      aria-label="color option"
                                      onSelectionChange={(keys) =>
                                        handleColorChange(
                                          keys,
                                          product.ProductId
                                        )
                                      }
                                    >
                                      {availableColors.map((color) => (
                                        <SelectItem key={color.Id}>
                                          {color.ColorName}
                                        </SelectItem>
                                      ))}
                                    </Select>
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <label className="text-sm text-gray-500 font-sans">
                                      Quantity
                                    </label>
                                    <Input
                                      type="number"
                                      placeholder="Enter Order Item Priority"
                                      className="w-full"
                                      value={(
                                        product.OrderItemPriority || 0
                                      ).toString()}
                                      onChange={(e) =>
                                        handlePriorityChange(
                                          product.ProductId,
                                          Number(e.target.value)
                                        )
                                      }
                                    />
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <label className="text-sm text-gray-500 font-sans">
                                      Printing Options
                                    </label>
                                    <Select
                                      className="max-w-xs"
                                      placeholder="Select Printing options"
                                      selectionMode="multiple"
                                      aria-label="printing option"
                                      selectedKeys={
                                        new Set(
                                          product.printingOptions.map(
                                            (opt) => opt.PrintingOptionId
                                          )
                                        )
                                      }
                                      onSelectionChange={(keys) =>
                                        handlePrintingOptionChange(
                                          keys,
                                          product.ProductId
                                        )
                                      }
                                    >
                                      {printingoptions!.map(
                                        (printingOption) => (
                                          <SelectItem key={printingOption?.Id}>
                                            {printingOption.Type}
                                          </SelectItem>
                                        )
                                      )}
                                    </Select>
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <label className="text-sm text-gray-500 font-sans">
                                      Priority
                                    </label>
                                    <Input
                                      type="number"
                                      placeholder="Enter Order Item Priority"
                                      className="w-full"
                                      value={(
                                        product.OrderItemPriority || 0
                                      ).toString()}
                                      onChange={(e) =>
                                        handlePriorityChange(
                                          product.ProductId,
                                          Number(e.target.value)
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <label className="text-sm text-gray-500 font-sans">
                                    Documents
                                  </label>
                                  <input
                                    type="file"
                                    className="border-2 rounded-lg p-1"
                                  />
                                </div>
                                <div className="flex flex-col">
                                  <label className="text-sm text-gray-500 font-sans">
                                    Description
                                  </label>
                                  <textarea
                                    className="border-2 rounded-lg p-2 bg-gray-100"
                                    rows={5}
                                    value={product.Description || ""}
                                    onChange={(e) =>
                                      handleDescriptionChange(
                                        product.ProductId,
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </AccordionItem>
                          ))}
                        </Accordion>
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
                      {!isEditOrder ? <>Add Order</> : <>Edit Order</>}
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
