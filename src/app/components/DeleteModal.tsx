import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import useOrderStore from "@/store/useOrderStore";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  clientId: number | undefined;
  onDeleteSuccess: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  orderId,
  clientId,
}) => {
  const { deleteOrder, loading } = useOrderStore();
  const handleDelete = async () => {
    try {
      await deleteOrder(orderId, clientId || 0, () => {
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
              <p>Are you sure you want to delete this order?</p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
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

export default DeleteModal;
