import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import useShipmentStore from "@/store/useShipmentStore";
import { useEffect, useMemo } from "react";
import { GiCargoShip } from "react-icons/gi";
import { FaBoxOpen } from "react-icons/fa";
import { formatDate } from "../../interfaces";
import { DOCUMENT_REFERENCE_TYPE } from "@/interface";
import RecentAttachmentsView from "../../components/RecentAttachmentsView";

interface ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  Id: number;
}

const ViewShipmentDetails: React.FC<ViewModalProps> = ({
  isOpen,
  onClose,
  Id,
}) => {
  const { getShipmentById, ShipmentById, loading } = useShipmentStore();

  useEffect(() => {
    if (Id) getShipmentById(Id);
  }, [Id, getShipmentById]);

  // Normalize shape (your store sets ShipmentById to the .data already)
  const ship = ShipmentById ?? null;

  const carrierName = useMemo(() => {
    // Prefer nested object if present, else fallback to flat name, else dash
    return ship?.ShipmentCarrier?.Name ?? ship?.ShipmentCarrierName ?? "-";
  }, [ship]);

  const boxes = useMemo(() => {
    const raw = (ship as any)?.boxes ?? (ship as any)?.Boxes ?? [];
    return Array.isArray(raw) ? raw : [];
  }, [ship]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="5xl">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {ship?.ShipmentCode ?? "-"}
            </ModalHeader>

            <ModalBody>
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-5">
                  {/* Shipping Info */}
                  <div className="bg-gray-100 rounded-lg p-3">
                    <h6 className="flex items-center gap-3 text-gray-700">
                      <GiCargoShip size={25} /> Shipping Info.
                    </h6>
                    <div className="grid grid-cols-3 gap-3 mt-5">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-700">Shipment Code</span>
                        <span>{ship?.ShipmentCode ?? "-"}</span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-xs text-gray-700">Carrier Name</span>
                        <span>{carrierName}</span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-xs text-gray-700">Shipment Date</span>
                        <span>{ship?.ShipmentDate ? formatDate(ship.ShipmentDate) : "-"}</span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-xs text-gray-700">Total Weight</span>
                        <span>
                          {(ship?.TotalWeight ?? "-")} {(ship?.WeightUnit ?? "")}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-xs text-gray-700">Number Of Boxes</span>
                        <span>{ship?.NumberOfBoxes ?? "-"}</span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-xs text-gray-700">Shipment Cost</span>
                        <span>{ship?.ShipmentCost ?? "-"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Shipment Items */}
                  <div className="bg-gray-100 rounded-lg p-3">
                    <h6 className="flex items-center gap-3 text-gray-700">
                      <FaBoxOpen size={25} /> Shipment Items Details
                    </h6>

                    <div className="overflow-auto h-[calc(100vh-500px)]">
                      {boxes.length === 0 ? (
                        <div className="text-sm text-gray-500 mt-4">
                          No boxes found.
                        </div>
                      ) : (
                        boxes.map((box: any, index: number) => (
                          <div className="grid grid-cols-4 gap-3 mt-5" key={index}>
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-700">Box No.</span>
                              <span>{box?.BoxNumber ?? "-"}</span>
                            </div>

                            <div className="flex flex-col">
                              <span className="text-xs text-gray-700">Weight</span>
                              <span>{box?.Weight ?? "-"}</span>
                            </div>

                            <div className="flex flex-col">
                              <span className="text-xs text-gray-700">Order Item</span>
                              <span>{box?.OrderItemName ?? "-"}</span>
                            </div>

                            <div className="flex flex-col">
                              <span className="text-xs text-gray-700">Quantity</span>
                              <span>{box?.Quantity ?? "-"}</span>
                            </div>

                            {box?.OrderItemDescription ? (
                              <div className="flex flex-col col-span-4">
                                <span className="text-xs text-gray-700">Description</span>
                                <span>{box.OrderItemDescription}</span>
                              </div>
                            ) : null}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <RecentAttachmentsView
                  referenceId={Id}
                  referenceType={DOCUMENT_REFERENCE_TYPE.SHIPMENT}
                />
              </div>
            </ModalBody>

            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose} disabled={loading}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ViewShipmentDetails;
