import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import useCategoryStore from "@/store/useCategoryStore";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  productIdCatagory: number;
}

const DeleteProductCatagory: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  productIdCatagory,
}) => {
  const {deleteCategory, loading} = useCategoryStore();

  const handleDelete = async () => {
    try {
      await deleteCategory(productIdCatagory, () => {
        onClose();
      });
    } catch (error) {
      console.error("Delete failed:", error);
    }
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
              <p>Are you sure you want to delete this Product Catagory?</p>
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

export default DeleteProductCatagory;
