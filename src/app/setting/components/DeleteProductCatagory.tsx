import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { fetchWithAuth } from "../../services/authservice";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  productIdCatagory: number;
  onDeleteSuccess: () => void;
}

const DeleteProductCatagory: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  productIdCatagory,
  onDeleteSuccess,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/product-category/${productIdCatagory}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setIsDeleting(false);
        onDeleteSuccess();
        onClose();
      }
    } catch (error) {
      setIsDeleting(false);
      console.error("Error deleting Product category:", error);
      alert("Failed to delete the Product. Please try again.");
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
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleDelete}
                isLoading={isDeleting}
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
