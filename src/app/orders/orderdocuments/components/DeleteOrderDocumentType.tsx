import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import useOrderDocumentTypesStore from "@/store/useOrderDocumentTypesStore";

interface DeleteOrderDocumentTypeProps {
  isOpen: boolean;
  onClose: () => void;
  orderDocumentTypeId: number;
  documentTypeName?: string;
}

const DeleteOrderDocumentType: React.FC<DeleteOrderDocumentTypeProps> = ({
  isOpen,
  onClose,
  orderDocumentTypeId,
  documentTypeName,
}) => {
  const { deleteOrderDocumentType, loading } = useOrderDocumentTypesStore();

  const handleDelete = async () => {
    await deleteOrderDocumentType(orderDocumentTypeId, onClose);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Confirm Deletion
            </ModalHeader>
            <ModalBody>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Are you sure you want to delete{" "}
                <span className="font-semibold">
                  {documentTypeName || "this order document type"}
                </span>
                ?
              </p>
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
              <Button color="primary" onPress={handleDelete} isLoading={loading}>
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DeleteOrderDocumentType;
