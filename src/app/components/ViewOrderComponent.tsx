import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { FaFirstOrderAlt } from "react-icons/fa6";
import { VscTarget } from "react-icons/vsc";
import { TbTimelineEventExclamation } from "react-icons/tb";
import { CiCalendarDate } from "react-icons/ci";

import StatusChip from "./StatusChip";
import { formatDate, Order } from "../interfaces";
import { OrderItem, useFetchOrderItems } from "../services/useFetchOrderItems";
import { fetchWithAuth } from "../services/authservice";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";

interface ViewOrderComponentProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOrder: Order | undefined;
}

const ViewOrderComponent: React.FC<ViewOrderComponentProps> = ({
  isOpen,
  onClose,
  selectedOrder,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [orderItems, setOrderItems] = useState<OrderItem[] | null>([]);

  useEffect(() => {
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
              Order Name will display here
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-5 p-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-5 lg:gap-y-5 gap-2">
                  <div className="grid grid-cols-2">
                    <div className="flex items-center gap-2">
                      <FaFirstOrderAlt />
                      <label className="text-gray-500 font-medium">
                        Order Id
                      </label>
                    </div>
                    <span className="text-gray-600 font-normal">
                      {selectedOrder?.Id}
                    </span>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="flex items-center gap-2">
                      <TbTimelineEventExclamation />
                      <label className="text-gray-500 font-medium">
                        Order Event
                      </label>
                    </div>
                    <span className="text-gray-600 font-normal">
                      {selectedOrder?.EventName}
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
                <div className="border-1 p-2 rounded-lg">
                  {selectedOrder?.Description}
                </div>
                <h1 className="font-semibold headerFontFamily">Order Items</h1>
                {isLoading ? (
                  <Spinner />
                ) : (
                  <div className="flex flex-col gap-1">
                    {orderItems?.map((item) => {
                      return (
                        <div className="border-2 p-1 rounded-lg bg-gray-200 flex items-center justify-between">
                          <span>{item.ProductId}</span>
                          <span>{item.ProductName}</span>
                          <span>{formatDate(item.CreatedOn)}</span>
                          <span>{item.Description}</span>
                        </div>
                      );
                    })}
                  </div>
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
