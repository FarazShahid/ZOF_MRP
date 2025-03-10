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
} from "@heroui/react";
import { MdDeleteOutline } from "react-icons/md";
import { Field, Form, Formik } from "formik";

import useClientEvents from "../services/useClientEvents";
import { useOrderStatus } from "../services/useOrderStatus";
import { OrderSchemaValidation } from "../schema/OrderSchema";
import { useFetchProducts } from "../services/useFetchProducts";
import {
  OrderItemType,
  AddOrderComponentProps,
  getProductNameById,
} from "../interfaces";
import { fetchWithAuth } from "../services/authservice";
import { useFetchPrintingOptions } from "../services/useFetchPrintingOptions";
import { useOrderDetails } from "../services/useOrderDetails";
import { FaCirclePlus } from "react-icons/fa6";
import useOrderStore, { orderItemDetailsType } from "@/store/useOrderStore";

const AddOrderComponent: React.FC<AddOrderComponentProps> = ({
  isOpen,
  onClose,
  clientId,
  isEditOrder,
  orderId,
  onOrderAdded,
}) => {
  const [value, setValue] = useState<string>("");
  const [selectedProducts, setSelectedProducts] = useState<OrderItemType[]>([]);
  const [selectedPrintingOptions, setSelectedPrintingOptions] = useState<
    number[] | undefined
  >([]);
  

  const { orderDetails, refetch } = useOrderDetails(orderId);
  const { events } = useClientEvents();
  const { statuses } = useOrderStatus();
  const { products } = useFetchProducts();
  const { printingoptions } = useFetchPrintingOptions();
  const { getAvailableColorByProductId, addOrder , updateOrder, availableColors } = useOrderStore();

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
            OrderItemQuantity: 0,
            Name: selectedItem.Name,
            ImageId: 0,
            FileId: 0,
            VideoId: 0,
            orderItemDetails: [{ ColorOptionId: 0, Quantity: 0, Priority: 0 }],
            printingOptions: [],
          };

          setSelectedProducts([...selectedProducts, newProduct]);
        }
        getAvailableColorByProductId(selectedItem.Id);
      }
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
  const addOrderItemDetail = (productId: number) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.ProductId === productId
          ? {
              ...product,
              orderItemDetails: [
                ...(product.orderItemDetails || []),
                { ColorOptionId: 0, Quantity: 0, Priority: 0 },
              ],
            }
          : product
      )
    );
  };
  const removeOrderItemDetail = (productId: number, index: number) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (product.ProductId === productId) {
          if (index === 0) return product;
          const updatedDetails = product.orderItemDetails.filter(
            (_: any, i: number) => i !== index
          );
          return { ...product, orderItemDetails: updatedDetails };
        }
        return product;
      })
    );
  };
  const handleOrderItemDetailColorChange = (
    productId: number,
    index: number,
    keys: any
  ) => {
    const selectedColorId = Array.from(keys)[0] as number;
    setSelectedProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (product.ProductId === productId) {
          const updatedDetails = product.orderItemDetails.map(
            (detail: any, i: number) =>
              i === index
                ? { ...detail, ColorOptionId: selectedColorId }
                : detail
          );
          return { ...product, orderItemDetails: updatedDetails };
        }
        return product;
      })
    );
  };
  const handleOrderItemDetailQuantityChange = (
    productId: number,
    index: number,
    quantity: number
  ) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (product.ProductId === productId) {
          const updatedDetails = product.orderItemDetails.map(
            (detail: any, i: number) =>
              i === index ? { ...detail, Quantity: quantity } : detail
          );
          return { ...product, orderItemDetails: updatedDetails };
        }
        return product;
      })
    );
  };
  const handleOrderItemDetailPriorityChange = (
    productId: number,
    index: number,
    priority: number
  ) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (product.ProductId === productId) {
          const updatedDetails = product.orderItemDetails.map(
            (detail: any, i: number) =>
              i === index ? { ...detail, Priority: priority } : detail
          );
          return { ...product, orderItemDetails: updatedDetails };
        }
        return product;
      })
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
        orderItemDetails: [],
      };

  const handleAddOrder = async (values: any) => {
    const Method = isEditOrder ? "PUT" : "POST";
    const URL = isEditOrder
      ? `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`
      : `${process.env.NEXT_PUBLIC_API_URL}/orders`;
    const orderPayload = {
      ClientId: clientId || 0,
      OrderEventId: values.OrderEventId,
      Description: values.Description,
      OrderStatusId: values.OrderStatusId,
      Deadline: values.Deadline,
      OrderNumber: "",
      OrderName: values.OrderName,
      OrderPriority: values.OrderPriority,
      ExternalOrderId: 1,
      items: selectedProducts.map((product) => {
        return {
          ProductId: product.ProductId,
          Description: product.Description,
          OrderItemPriority: product.OrderItemPriority,
          OrderItemQuantity: product.OrderItemQuantity,
          ImageId: product.ImageId,
          FileId: product.FileId,
          VideoId: product.VideoId,
          orderItemDetails: product.orderItemDetails.map((option) => {
            return {
              ColorOptionId: option.ColorOptionId,
              Quantity: option.Quantity,
              Priority: option.Priority,
            };
          }),
          printingOptions: product.printingOptions.map((option) => {
            return {
              PrintingOptionId: option.PrintingOptionId,
              Description: option.Description,
            };
          }),
        };
      }),
    };
   
    // try {
    //   const response = await fetchWithAuth(URL, {
    //     method: Method,
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(orderPayload),
    //   });

    //   if (!response.ok) {
    //     console.log("Error creating order");
    //     throw new Error("Failed to create order");
    //   }
    //   const result = await response.json();
    //   handleModalClose();
    //   onOrderAdded();
    // } catch (error) {
    //   console.error("Error creating order:", error);
    // }
    isEditOrder
    ? updateOrder(orderId, orderPayload, () => {
      onClose();
      })
    : addOrder(orderPayload, () => {
      onClose();
      });
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
        OrderItemQuantity: item.OrderItemQuantity || 0,
        Name: "",
        ImageId: item.ImageId || 0,
        FileId: item.FileId || 0,
        VideoId: item.VideoId || 0,
        orderItemDetails: item.orderItemDetails || [],
        printingOptions: item.printingOptions || [],
      }));

      setSelectedProducts(formattedItems);
    } else {
      setSelectedProducts([]);
    }
  }, [isEditOrder, orderId, orderDetails, isOpen]);

  useEffect(() => {
    if (isEditOrder && selectedProducts.length > 0) {
      selectedProducts.forEach((product) => {
        if (!availableColors[product.ProductId]) {
          getAvailableColorByProductId(product.ProductId);
        }
      });
    }
  }, [isEditOrder, selectedProducts, availableColors]);

  return (
    <Modal
      isOpen={isOpen}
      size="full"
      classNames={{ body: "AddOorderModalBody" }}
      onOpenChange={handleModalClose}
    >
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
              {({ isSubmitting }) => (
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
                                className="formInputdefault border-2"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="font-medium text-sm text-[#181818]">
                                Order Event
                              </label>
                              <Field
                                as="select"
                                name="OrderEventId"
                                className="formInputdefault border-2"
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
                                className="formInputdefault border-2"
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
                                className="formInputdefault border-2"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="font-medium text-sm text-[#181818]">
                                Order Priority
                              </label>
                              <Field
                                name="OrderPriority"
                                type="number"
                                className="formInputdefault border-2"
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
                              className="formInputdefault border-2 !h-auto"
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
                                <div className="flex flex-col gap-1">
                                  <h6 className="text-md font-medium">
                                    Order Item Details
                                  </h6>
                                  {product.orderItemDetails &&
                                    product.orderItemDetails.map(
                                      (detail: any, index: number) => (
                                        <div
                                          key={index}
                                          className="border p-2 rounded-md mb-2"
                                        >
                                          <div className="flex items-center gap-4">
                                            <div className="flex flex-col gap-1 w-full">
                                              <label className="text-sm text-[#181818] font-sans">
                                                Available Colors
                                              </label>
                                              <Select
                                                className="w-full"
                                                placeholder="Select Color"
                                                selectionMode="single"
                                                aria-label="Color option"
                                                selectedKeys={
                                                  detail.ColorOptionId ||
                                                  detail.ColorOptionId === 0
                                                    ? new Set([
                                                        String(
                                                          detail.ColorOptionId
                                                        ),
                                                      ])
                                                    : new Set()
                                                }
                                                onSelectionChange={(keys) =>
                                                  handleOrderItemDetailColorChange(
                                                    product.ProductId,
                                                    index,
                                                    keys
                                                  )
                                                }
                                              >
                                                {(
                                                  availableColors[
                                                    product.ProductId
                                                  ] || []
                                                ).map((color) => (
                                                  <SelectItem key={color.Id}>
                                                    {color.ColorName}
                                                  </SelectItem>
                                                ))}
                                              </Select>
                                            </div>
                                            <div className="flex flex-col gap-1 w-full">
                                              <label className="text-sm text-gray-600 font-sans">
                                                Quantity
                                              </label>
                                              <Input
                                                type="number"
                                                placeholder="Enter Quantity"
                                                className="w-full"
                                                value={detail.Quantity}
                                                onChange={(e) =>
                                                  handleOrderItemDetailQuantityChange(
                                                    product.ProductId,
                                                    index,
                                                    Number(e.target.value)
                                                  )
                                                }
                                              />
                                            </div>
                                            <div className="flex flex-col gap-1 w-full">
                                              <label className="text-sm text-gray-600 font-sans">
                                                Priority
                                              </label>
                                              <Input
                                                type="number"
                                                placeholder="Enter Priority"
                                                className="w-full"
                                                value={detail.Priority}
                                                onChange={(e) =>
                                                  handleOrderItemDetailPriorityChange(
                                                    product.ProductId,
                                                    index,
                                                    Number(e.target.value)
                                                  )
                                                }
                                              />
                                            </div>
                                          </div>
                                          {index > 0 && (
                                            <div className="flex justify-end mt-2">
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  removeOrderItemDetail(
                                                    product.ProductId,
                                                    index
                                                  )
                                                }
                                                className="text-red-600"
                                              >
                                                <MdDeleteOutline />
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      )
                                    )}
                                  <div className="flex justify-end">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        addOrderItemDetail(product.ProductId)
                                      }
                                      className="text-blue-600"
                                    >
                                      <FaCirclePlus />
                                    </button>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 w-full">
                                  <div className="flex flex-col gap-1 w-full">
                                    <label className="text-sm text-[#181818] font-sans">
                                      Printing Options
                                    </label>
                                    <Select
                                      className="w-full"
                                      placeholder="Select Printing options"
                                      selectionMode="multiple"
                                      aria-label="printing option"
                                      selectedKeys={
                                        new Set(
                                          product.printingOptions.map((opt) =>
                                            String(opt.PrintingOptionId)
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
                                  <div className="flex flex-col gap-1 w-full">
                                    <label className="text-sm text-[#181818] font-sans">
                                      Order Priority
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
                                  <label className="text-sm text-[#181818] font-sans">
                                    Documents
                                  </label>
                                  <input
                                    type="file"
                                    className="border-2 rounded-lg p-1"
                                  />
                                </div>
                                <div className="flex flex-col">
                                  <label className="text-sm text-[#181818] font-sans">
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
