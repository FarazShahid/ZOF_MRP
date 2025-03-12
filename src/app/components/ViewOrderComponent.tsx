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
import { FaUser } from "react-icons/fa";
import { BsFillCalendarEventFill } from "react-icons/bs";
import { CgInternal } from "react-icons/cg";
import useOrderStore from "@/store/useOrderStore";
import ShowPriorityStatus from "./ShowPriorityStatus";

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
    if (selectedOrderId > 0) {
      getOrderById(selectedOrderId);
    }
  }, [selectedOrderId, isOpen]);

  return (
    <Modal isOpen={isOpen} size="4xl" onOpenChange={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-gray-700 border-b-1 font-normal text-medium">
              {OrderById.ClientName} / {OrderById?.OrderName} /{" "}
              {OrderById?.OrderNumber}
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-3 px-5 mt-5">
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
                  <div className="flex items-center gap-5">
                    <div className="flex items-center gap-3">
                      <FaUser color="#5d5d5d" />
                      <label className="font-medium ">Client Name:</label>
                    </div>
                    <div>{OrderById?.ClientName}</div>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="flex items-center gap-3">
                      <BsFillCalendarEventFill color="#5d5d5d" />
                      <label className="font-medium ">Event Name:</label>
                    </div>
                    <div>{OrderById?.EventName}</div>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="flex items-center gap-3">
                      <BsFillCalendarEventFill color="#5d5d5d" />
                      <label className="font-medium ">Order Name:</label>
                    </div>
                    <div>{OrderById?.OrderName}</div>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="flex items-center gap-3">
                      <BsFillCalendarEventFill color="#5d5d5d" />
                      <label className="font-medium ">Order Number:</label>
                    </div>
                    <div>{OrderById?.OrderNumber}</div>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="flex items-center gap-3">
                      <BsFillCalendarEventFill color="#5d5d5d" />
                      <label className="font-medium ">Priority:</label>
                    </div>
                    <div className="flex items-center gap-1">
                      <ShowPriorityStatus priority={OrderById?.OrderPriority} />
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="flex items-center gap-3">
                      <BsFillCalendarEventFill color="#5d5d5d" />
                      <label className="font-medium ">Status:</label>
                    </div>
                    <StatusChip OrderStatus={OrderById?.StatusName || ""} />
                  </div>
                </div>
                {/* <div className="flex items-center flex-wrap gap-2">
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
                </div> */}
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
                            <div className="grid grid-cols-3 gap-1">
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
