import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import useCarriorStore from "@/store/useCarriorStore";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  Id: number;
}

const DeleteCarrior: React.FC<DeleteModalProps> = ({ isOpen, onClose, Id }) => {


  const {deleteCarrior, loading} = useCarriorStore();

  const handleDelete = async () => {
    try {
      await deleteCarrior(Id, () => {
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
              <p>Are you sure you want to delete this?</p>
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

export default DeleteCarrior;
