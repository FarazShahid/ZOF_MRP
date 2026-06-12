import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

import useProductSubCategoryStore from "@/store/useProductSubCategoryStore";

interface DeleteProductSubCategoryProps {
  isOpen: boolean;
  onClose: () => void;
  productSubCategoryId: number;
}

const DeleteProductSubCategory: React.FC<DeleteProductSubCategoryProps> = ({
  isOpen,
  onClose,
  productSubCategoryId,
}) => {
  const { deleteProductSubCategory, loading } = useProductSubCategoryStore();

  const handleDelete = async () => {
    await deleteProductSubCategory(productSubCategoryId, onClose);
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
              <p>Are you sure you want to delete this product sub category?</p>
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

export default DeleteProductSubCategory;
