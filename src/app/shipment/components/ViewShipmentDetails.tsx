import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import useShipmentStore from "@/store/useShipmentStore";
import { useEffect } from "react";
import { GiCargoShip } from "react-icons/gi";
import { FaBoxOpen } from "react-icons/fa";
import { IoDocumentAttach } from "react-icons/io5";
import { formatDate } from "../../interfaces";
import { useDocumentCenterStore } from "@/store/useDocumentCenterStore";
import { DOCUMENT_REFERENCE_TYPE } from "@/interface";
import DocumentCard from "../../orders/components/DocumentCard";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  Id: number;
}

const ViewShipmentDetails: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  Id,
}) => {
  const { getShipmentById, ShipmentById, loading } = useShipmentStore();
  const { fetchDocuments, documents } = useDocumentCenterStore();

  useEffect(() => {
    if (Id) {
      getShipmentById(Id);
      fetchDocuments(DOCUMENT_REFERENCE_TYPE.SHIPMENT, Id);
    }
  }, [Id]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="5xl">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {ShipmentById?.ShipmentCode}
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-5">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <h6 className="flex items-center gap-3 text-gray-700">
                      <GiCargoShip size={25} /> Shipping Info.
                    </h6>
                    <div className="grid grid-cols-3 gap-3 mt-5">
                      <div className="flex flex-col ">
                        <span className="text-xs text-gray-700">
                          Shippment Code
                        </span>
                        <span>{ShipmentById?.ShipmentCode}</span>
                      </div>
                      <div className="flex flex-col ">
                        <span className="text-xs text-gray-700">
                          Carrier Name
                        </span>
                        <span>{ShipmentById?.ShipmentCarrier.Name}</span>
                      </div>
                      <div className="flex flex-col ">
                        <span className="text-xs text-gray-700">
                          Shipment Date
                        </span>
                        <span>
                          {formatDate(ShipmentById?.ShipmentDate || "")}
                        </span>
                      </div>
                      <div className="flex flex-col ">
                        <span className="text-xs text-gray-700">
                          Total Weight
                        </span>
                        <span>
                          {ShipmentById?.TotalWeight} {ShipmentById?.WeightUnit}
                        </span>
                      </div>
                      <div className="flex flex-col ">
                        <span className="text-xs text-gray-700">
                          Number Of Boxes
                        </span>
                        <span>{ShipmentById?.NumberOfBoxes}</span>
                      </div>
                      <div className="flex flex-col ">
                        <span className="text-xs text-gray-700">
                          Shipment Cost
                        </span>
                        <span>{ShipmentById?.ShipmentCost}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-100 rounded-lg p-3">
                    <h6 className="flex items-center gap-3 text-gray-700">
                      <FaBoxOpen size={25} /> Shippment Items Details
                    </h6>
                    {ShipmentById?.Boxes.map((box, index) => {
                      return (
                        <div
                          className="grid grid-cols-4 gap-3 mt-5"
                          key={index}
                        >
                          <div className="flex flex-col ">
                            <span className="text-xs text-gray-700">
                              Box No.
                            </span>
                            <span>{box.BoxNumber}</span>
                          </div>
                          <div className="flex flex-col ">
                            <span className="text-xs text-gray-700">
                              Weight
                            </span>
                            <span>{box.Weight}</span>
                          </div>
                          <div className="flex flex-col ">
                            <span className="text-xs text-gray-700">
                              Order Item
                            </span>
                            <span>{box.OrderItem}</span>
                          </div>
                          <div className="flex flex-col ">
                            <span className="text-xs text-gray-700">
                              Quantity
                            </span>
                            <span>{box.Quantity}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-gray-100 rounded-lg p-3">
                  <h6 className="flex items-center gap-3 text-gray-700">
                    <IoDocumentAttach size={25} /> Attachments
                  </h6>
                  {documents && (
                    <div className="flex flex-wrap gap-2 mt-5">
                      {documents?.map((doc, index) => {
                        return (
                          <DocumentCard
                            key={index}
                            fileTitle={doc.fileName}
                            fileType={doc.fileType}
                            path={doc.fileUrl}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="flat"
                onPress={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ViewShipmentDetails;
