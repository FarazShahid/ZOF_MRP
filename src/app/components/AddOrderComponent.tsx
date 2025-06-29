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
import { OrderSchemaValidation } from "../schema/OrderSchema";
import { OrderItemType, AddOrderComponentProps } from "../interfaces";
import { FaCirclePlus } from "react-icons/fa6";
import useOrderStore from "@/store/useOrderStore";
import useEventsStore from "@/store/useEventsStore";
import usePrintingOptionsStore from "@/store/usePrintingOptionsStore";
import useProductStore from "@/store/useProductStore";
import useClientStore from "@/store/useClientStore";
import Label from "./common/Label";
import useMediaHandlerStore from "@/store/useMediaHandlerStore";

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

  const { Events, fetchEvents } = useEventsStore();
  const { fetchProducts, products } = useProductStore();
  const { printingOptions, fetchprintingOptions } = usePrintingOptionsStore();
  const { fetchClients, clients } = useClientStore();
  const {
    getAvailableColorByProductId,
    addOrder,
    updateOrder,
    getOrderStatus,
    getOrderById,
    OrderById,
    availableColors,
  } = useOrderStore();

  const { isUploading, uploadError, uploadFile, uploadResult } = useMediaHandlerStore();

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
            Name: selectedItem.Name,
            ProductCategoryName: selectedItem.ProductCategoryName || "",
            ProductFabricName: selectedItem.FabricName || "",
            ProductFabricType: selectedItem.FabricType || "",
            ProductFabricGSM: selectedItem.GSM || 0,
            ImageId: 1,
            FileId: 1,
            VideoId: 1,
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
      const allKeys = printingOptions?.map(
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
                Description: "Description",
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
      ClientId: OrderById.ClientId || 0,
      OrderEventId: OrderById?.OrderEventId || "",
      Deadline: OrderById?.Deadline
        ? new Date(OrderById.Deadline).toISOString().split("T")[0]
        : "",
      Description: OrderById?.Description || "",
      OrderPriority: OrderById?.OrderPriority || "",
      OrderName: OrderById?.OrderName || "",
    }
    : {
      ClinetId: 0,
      OrderEventId: "",
      OrderStatusId: "",
      Deadline: "",
      Description: "",
      OrderPriority: "",
      orderItemDetails: [],
    };

  const handleAddOrder = async (values: any) => {
    const orderPayload = {
      ClientId: values.ClientId || 0,
      OrderEventId: values.OrderEventId,
      Description: values.Description,
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
    isEditOrder
      ? updateOrder(orderId, orderPayload, () => {
        onClose();
      })
      : addOrder(orderPayload, () => {
        onClose();
      });
  };

  useEffect(() => {
    if (isEditOrder && isOpen && orderId) {
      getOrderById(orderId);
    }
  }, [isEditOrder, isOpen, orderId]);

  useEffect(() => {
    if (isEditOrder && orderId && OrderById) {
      const formattedItems = OrderById.items.map((item) => ({
        ProductId: item.ProductId,
        Description: item.Description || "",
        OrderItemPriority: item.OrderItemPriority || 0,
        Name: "",
        ProductCategoryName: item.ProductCategoryName || "",
        ProductFabricName: item.ProductFabricName || "",
        ProductFabricType: item.ProductFabricType || "",
        ProductFabricGSM: Number(item.ProductFabricGSM) || 0,
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
  }, [isEditOrder, orderId, OrderById, isOpen]);

  useEffect(() => {
    if (isEditOrder && selectedProducts.length > 0) {
      selectedProducts.forEach((product) => {
        if (!availableColors[product.ProductId]) {
          getAvailableColorByProductId(product.ProductId);
        }
      });
    }
  }, [isEditOrder, selectedProducts, availableColors]);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        getOrderStatus(),
        fetchEvents(),
        fetchprintingOptions(),
        fetchProducts(),
        fetchClients(),
      ]);
    };
    fetchData();
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      size="5xl"
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
                      <div className="flex flex-col gap-5 rounded-lg p-3">
                        <h6 className="text-lg font-medium">Order Details</h6>
                        <div className="flex flex-col gap-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            <div className="flex flex-col gap-1">
                              <Label isRequired={false} label="Client" />
                              <Field
                                as="select"
                                name="ClientId"
                                className="formInputdefault"
                              >
                                <option value="">Select a client</option>
                                {clients.map((client) => (
                                  <option key={client.Id} value={client.Id}>
                                    {client.Name}
                                  </option>
                                ))}
                              </Field>
                            </div>
                            <div className="flex flex-col gap-1">
                              <Label isRequired={false} label="Order Event" />
                              <Field
                                as="select"
                                name="OrderEventId"
                                className="formInputdefault"
                              >
                                <option value="">Select an event</option>
                                {Events.map((event) => (
                                  <option key={event.Id} value={event.Id}>
                                    {event.EventName}
                                  </option>
                                ))}
                              </Field>
                            </div>
                            <div className="flex flex-col gap-1">
                              <Label isRequired={false} label="Deadline" />
                              <Field
                                name="Deadline"
                                type="date"
                                className="formInputdefault"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <Label isRequired={false} label="Order Priority" />
                              <Field
                                name="OrderPriority"
                                type="number"
                                className="formInputdefault"
                                min={0}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <Label isRequired={false} label="Description" />
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
                      <div className="flex flex-col gap-5 rounded-lg p-3">
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
                                {product.FabricName}
                                {product.ProductCategoryName} {product?.GSM}
                              </AutocompleteItem>
                            )}
                          </Autocomplete>
                        </div>

                        <Accordion variant="splitted">
                          {selectedProducts.map((product) => (
                            <AccordionItem
                              key={product.ProductId}
                              aria-label={`accordion-${product.ProductId}`}
                              title={`${product.ProductFabricName} ${product.ProductCategoryName} ${product.ProductFabricGSM}`}
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
                                              <Label isRequired={false} label="Available Colors" />
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
                                              <Label isRequired={false} label="Quantity" />
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
                                              <Label isRequired={false} label="Priority" />
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
                                    <Label isRequired={false} label="Printing Options" />
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
                                      {printingOptions!.map(
                                        (printingOption) => (
                                          <SelectItem key={printingOption?.Id}>
                                            {printingOption.Type}
                                          </SelectItem>
                                        )
                                      )}
                                    </Select>
                                  </div>
                                  <div className="flex flex-col gap-1 w-full">
                                    <Label isRequired={false} label="Order Priority" />
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
                                  <Label isRequired={false} label="Documents" />
                                  <input
                                    type="file"
                                    className="border-2 rounded-lg p-1"
                                  />
                                </div>
                                <div className="flex flex-col">
                                  <Label isRequired={false} label="Description" />
                                  <textarea
                                    className="border-2 rounded-lg p-2"
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
