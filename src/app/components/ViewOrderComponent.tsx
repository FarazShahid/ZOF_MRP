import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
  Accordion,
  AccordionItem,
} from "@nextui-org/react";
import { VscTarget } from "react-icons/vsc";
import { CiCalendarDate } from "react-icons/ci";
import { TbExternalLink } from "react-icons/tb";

import Spinner from "./Spinner";
import StatusChip from "./StatusChip";
import { formatDate, Order } from "../interfaces";
import { CgInternal } from "react-icons/cg";
import { fetchWithAuth } from "../services/authservice";

interface ViewOrderComponentProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOrder: Order | undefined;
}

interface ViewOrderItemType {
  ColorName: string;
  ColorOptionId: number;
  CreatedOn: string;
  Description: string;
  FileId: number;
  Id: number;
  ImageId: number;
  OrderId: number;
  OrderItemPriority: number;
  OrderItemQuantity: number;
  ProductId: number;
  ProductName: string;
  UpdatedOn: string;
  VideoId: number;
  printingOptions: {
    printingOptionId: number;
    Description: string;
    PrintingOptionName: string;
  }[];
}

const ViewOrderComponent: React.FC<ViewOrderComponentProps> = ({
  isOpen,
  onClose,
  selectedOrder,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [orderItems, setOrderItems] = useState<ViewOrderItemType[] | null>([]);

  useEffect(() => {
    if(!selectedOrder){
      return
    }
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/items/${selectedOrder?.Id}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch products:`);
        }
        const data = await response.json();
        setOrderItems(data);
      } catch (err: unknown) {
        setOrderItems(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedOrder?.Id]);

  return (
    <Modal isOpen={isOpen} size="3xl" onOpenChange={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {selectedOrder?.OrderName}
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-3 px-5">
                <div className="grid grid-cols-1 md:grid-col-2 lg:grid-cols-2 lg:gap-x-5 lg:gap-y-5 gap-2">
                  <div className="grid grid-cols-2">
                    <div className="flex items-center gap-2">
                      <CgInternal />
                      <label className="text-gray-500 font-medium">
                        Order No.
                      </label>
                    </div>
                    <span className="text-gray-600 font-normal">
                      {selectedOrder?.OrderNumber}
                    </span>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="flex items-center gap-2">
                      <TbExternalLink />
                      <label className="text-gray-500 font-medium">
                        External Order Id
                      </label>
                    </div>
                    <span className="text-gray-600 font-normal">
                      {selectedOrder?.ExternalOrderId}
                    </span>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="flex items-center gap-2">
                      <CiCalendarDate />
                      <label className="text-gray-500 font-medium">
                        Deadline
                      </label>
                    </div>
                    <span className="text-gray-600 font-normal">
                      {formatDate(selectedOrder?.Deadline || "")}
                    </span>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="flex items-center gap-2">
                      <VscTarget />
                      <label className="text-gray-500 font-medium">
                        Status
                      </label>
                    </div>
                    <StatusChip OrderStatus={selectedOrder?.StatusName || ""} />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-medium">Description:</label>
                  <div className="border-1 p-2 rounded-lg">
                    {selectedOrder?.Description}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <h1 className="font-semibold headerFontFamily">
                    Order Items
                  </h1>
                  {orderItems && orderItems?.length > 0 && (
                    <Chip variant="flat" size="sm" color="success">
                      {orderItems?.length}
                    </Chip>
                  )}
                </div>

                {isLoading ? (
                  <Spinner />
                ) : (
                  <Accordion variant="splitted">
                    {orderItems &&
                      orderItems.map((product) => (
                        <AccordionItem
                          key={product.Id}
                          aria-label={`accordion-${product.Id}`}
                          title={product.ProductName}
                        >
                          <div className="flex flex-col">
                            <div className="grid grid-cols-2 gap-1">
                              <div className="flex items-center gap-5">
                                <label className="text-sm text-gray-700">
                                  Color:
                                </label>
                                <div className="flex items-center gap-1">
                                  <span className="text-sm">
                                    {product.ColorName}
                                  </span>
                                  <div
                                    className="w-3 h-3 rounded-lg"
                                    style={{
                                      background: `${product.ColorName}`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                              <div className="flex items-center gap-5">
                                <label className="text-sm text-gray-700">
                                  Quantity:
                                </label>
                                <span className="text-sm">
                                  {product.OrderItemQuantity}
                                </span>
                              </div>
                              <div className="flex items-center gap-5">
                                <label className="text-sm text-gray-700">
                                  Priority:
                                </label>
                                <span className="text-sm">
                                  {product.OrderItemPriority}
                                </span>
                              </div>
                              <div className="flex items-center gap-5">
                                <label className="text-sm text-gray-700">
                                  Printing options:
                                </label>
                                <div className="flex items-center gap-1">
                                  {product.printingOptions.map(
                                    (printingOption) => {
                                      return (
                                        <span className="text-sm">
                                          {printingOption.PrintingOptionName},
                                        </span>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                            </div>
                           
                              <div className="flex flex-col gap-1 mt-3">
                                <h6>Uploaded documents</h6>
                                <div
                                  key={1}
                                  className="border rounded-lg p-2 w-full flex items-center gap-5"
                                >
                                  <img
                                    src="/tshirtMockUp.jpg"
                                    className="w-12 h-12"
                                    alt="doc item"
                                  />
                                  <div className="flex flex-col gap-1">
                                    <span className="text-sm">
                                      T shirt frontside
                                    </span>
                                    <span className="text-[#9A9EA5] text-xs">
                                      JPEG | 13MB
                                    </span>
                                  </div>
                                </div>
                              </div>
                         

                            <div className="flex flex-col gap-1 mt-3">
                              <h6>Description</h6>
                              <div className="text-sm border p-2 rounded-lg">
                                {product.Description}
                              </div>
                            </div>
                          </div>
                        </AccordionItem>
                      ))}
                  </Accordion>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ViewOrderComponent;
