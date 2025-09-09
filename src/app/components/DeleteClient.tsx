import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import useClientStore from "@/store/useClientStore";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: number;
}

const DeleteClient: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  clientId,
}) => {
const {loading, deleteclient} = useClientStore();
    const handleDelete = async () => {
      try {
        await deleteclient(clientId, () => {
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
              <p>Are you sure you want to delete this client?</p>
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

export default DeleteClient;
