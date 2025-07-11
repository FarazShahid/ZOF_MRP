import { useEffect } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@heroui/react";
import useInventoryItemsStore from "@/store/useInventoryItemsStore";
import { DOCUMENT_REFERENCE_TYPE } from "@/interface";
import RecentAttachmentsView from "../components/RecentAttachmentsView";

interface ComponentProps {
  isOpen: boolean;
  Id: number;
  closeAddModal: () => void;
}

const ViewItem: React.FC<ComponentProps> = ({ isOpen, closeAddModal, Id }) => {
  const { loading, getInventoryItemById, inventoryItemById } =
    useInventoryItemsStore();

  useEffect(() => {
    if (Id) {
      getInventoryItemById(Id);
    }
  }, [Id]);

  return (
    <Modal isOpen={isOpen} size="2xl" onOpenChange={closeAddModal}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {inventoryItemById?.Name}
            </ModalHeader>
            <ModalBody>
              {loading ? (
                <Spinner />
              ) : (
                <div className="max-h-[calc(100vh-285px)] overflow-x-auto">
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <div className="flex items-center gap-10">
                      <div className="">Name:</div>
                      <p>{inventoryItemById?.Name}</p>
                    </div>
                    <div className="flex items-center gap-10">
                      <div>Sub Category:</div>
                      <p>{inventoryItemById?.SubCategoryName}</p>
                    </div>
                    <div className="flex items-center gap-10">
                      <div>Supplier:</div>
                      <p>{inventoryItemById?.SupplierName}</p>
                    </div>
                    <div className="flex items-center gap-10">
                      <div>Unit Of Measure:</div>
                      <p>{inventoryItemById?.UnitOfMeasureName}</p>
                    </div>
                    <div className="flex items-center gap-10">
                      <div>Reorder Level:</div>
                      <p>{inventoryItemById?.ReorderLevel}</p>
                    </div>
                  </div>
                  <RecentAttachmentsView
                    referenceId={Id}
                    referenceType={DOCUMENT_REFERENCE_TYPE.INVENTORY_ITEMS}
                  />
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={closeAddModal}>
                Cancel
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ViewItem;
