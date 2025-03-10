import { useEffect } from "react";
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
} from "@heroui/react";
import { VscTarget } from "react-icons/vsc";
import { CiCalendarDate } from "react-icons/ci";
import { TbExternalLink } from "react-icons/tb";

import Spinner from "./Spinner";
import StatusChip from "./StatusChip";
import { formatDate } from "../interfaces";
import { CgInternal } from "react-icons/cg";
import useOrderStore from "@/store/useOrderStore";

interface ViewOrderComponentProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOrderId: number;
}


const ViewOrderComponent: React.FC<ViewOrderComponentProps> = ({
  isOpen,
  onClose,
  selectedOrderId,
}) => {
  const { getOrderById, loading, OrderById } = useOrderStore();

  useEffect(() => {
    if (selectedOrderId) {
      getOrderById(selectedOrderId);
    }
  }, [selectedOrderId]);

  return (
    <Modal isOpen={isOpen} size="3xl" onOpenChange={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {OrderById?.OrderName}
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
                      {OrderById?.OrderNumber}
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
                      {OrderById?.ExternalOrderId}
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
                      {formatDate(OrderById?.Deadline || "")}
                    </span>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="flex items-center gap-2">
                      <VscTarget />
                      <label className="text-gray-500 font-medium">
                        Status
                      </label>
                    </div>
                    <StatusChip OrderStatus={OrderById?.StatusName || ""} />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-medium">Description:</label>
                  <div className="border-1 p-2 rounded-lg">
                    {OrderById?.Description}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <h1 className="font-semibold headerFontFamily">
                    Order Items
                  </h1>
                  {OrderById && OrderById?.items?.length > 0 && (
                    <Chip variant="flat" size="sm" color="success">
                      {OrderById?.items?.length}
                    </Chip>
                  )}
                </div>

                {loading ? (
                  <Spinner />
                ) : (
                  <Accordion variant="splitted">
                    {OrderById &&
                      OrderById?.items?.map((OrderItem) => (
                        <AccordionItem
                          key={`${OrderItem.Id}_${OrderItem.OrderName}`}
                          aria-label={`accordion-${OrderItem.Id}`}
                          title={OrderItem?.ProductName}
                        >
                          <div className="flex flex-col">
                            <div className="grid grid-cols-2 gap-1">
                              <div className="flex items-center gap-5">
                                <label className="text-sm text-gray-700">
                                  Color:
                                </label>
                                <div className="flex items-center gap-1">
                                  {OrderItem?.orderItemDetails?.map(
                                    (option) => {
                                      return (
                                        <div className="flex items-center gap-1">
                                          <span className="text-sm">
                                            {option?.ColorName}
                                          </span>
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-5">
                                <label className="text-sm text-gray-700">
                                  Quantity:
                                </label>
                                <div className="flex items-center gap-1">
                                  {OrderItem?.orderItemDetails?.map(
                                    (option) => {
                                      return (
                                        <span className="text-sm">
                                          {option?.Quantity}
                                        </span>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-5">
                                <label className="text-sm text-gray-700">
                                  Priority:
                                </label>
                                <div className="flex items-center gap-1">
                                  {OrderItem?.orderItemDetails?.map(
                                    (option) => {
                                      return (
                                        <span className="text-sm">
                                          {option?.Priority}
                                        </span>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-5">
                                <label className="text-sm text-gray-700">
                                  Printing options:
                                </label>
                                <div className="flex items-center gap-1">
                                  {OrderItem.printingOptions.map(
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
                                {OrderItem?.Description}
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
