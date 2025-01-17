import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { useState } from "react";
import { fetchWithAuth } from "../services/authservice";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: number;
  onDeleteSuccess: () => void;
}

const DeleteClient: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  clientId,
  onDeleteSuccess,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/clients/${clientId}`,
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
      console.error("Error deleting client:", error);
      alert("Failed to delete the client. Please try again.");
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
              <p>Are you sure you want to delete this client?</p>
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

export default DeleteClient;
