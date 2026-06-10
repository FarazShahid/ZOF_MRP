import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

import useProductComponentTypesStore from "@/store/useProductComponentTypesStore";

interface DeleteProductComponentTypeProps {
  isOpen: boolean;
  onClose: () => void;
  componentTypeId: number;
}

const DeleteProductComponentType: React.FC<DeleteProductComponentTypeProps> = ({
  isOpen,
  onClose,
  componentTypeId,
}) => {
  const { deleteProductComponentType, loading } =
    useProductComponentTypesStore();

  const handleDelete = async () => {
    await deleteProductComponentType(componentTypeId, onClose);
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
              <p>Are you sure you want to delete this product component type?</p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="flat"
                onPress={onClose}
                isDisabled={loading}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleDelete}
                isLoading={loading}
              >
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DeleteProductComponentType;
