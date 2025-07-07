import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@heroui/react";
import { Field, Formik, Form, ErrorMessage } from "formik";
import useInventoryItemsStore, {
  AddInventoryItemOptions,
} from "@/store/useInventoryItemsStore";
import useInventorySubCategoryStore from "@/store/useInventorySubCategoryStore";
import useSupplierStore from "@/store/useSupplierStore";
import useUnitOfMeasureStore from "@/store/useUnitOfMeasureStore";
import { InventoryItemSchema } from "../schema/InventoryItemSchema";
import Label from "../components/common/Label";
import useInventoryCategoryStore from "@/store/useInventoryCategoryStore";
import DropZoneMultiple from "../components/DropZone/DropZoneMultiple";
import { useDocumentCenterStore } from "@/store/useDocumentCenterStore";
import { DOCUMENT_REFERENCE_TYPE } from "@/interface";
import DocumentCard from "../orders/components/DocumentCard";

interface ComponentProps {
  isOpen: boolean;
  Id: number;
  closeAddModal: () => void;
}

const ViewItem: React.FC<ComponentProps> = ({ isOpen, closeAddModal, Id }) => {
  const { loading, getInventoryItemById, inventoryItemById } =
    useInventoryItemsStore();

  const { fetchDocuments, documents } = useDocumentCenterStore();

  useEffect(() => {
    if (Id) {
      getInventoryItemById(Id);
      fetchDocuments(DOCUMENT_REFERENCE_TYPE.INVENTORY_ITEMS, Id);
    }
  }, [Id]);

  console.log("documents", documents);

  return (
    <Modal isOpen={isOpen} size="2xl" onOpenChange={closeAddModal}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">{inventoryItemById?.Name}</ModalHeader>
            <ModalBody>
              {loading ? (
                <Spinner />
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
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

                  {documents && (
                    <div className="flex flex-wrap gap-2">
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
                </>
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
