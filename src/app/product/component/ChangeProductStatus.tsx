import useProductStore from "@/store/useProductStore";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  title: string;
  currentStatus: boolean;
}

const ChangeProductStatus: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  productId,
  title,
  currentStatus,
}) => {
  const { changeProductStatus, loading } = useProductStore();

  const handleChangeStatus = async () => {
    try {
      await changeProductStatus(productId, !currentStatus, () => {
        onClose();
      });
    } catch (error) {
      console.error("Update failed:", error);
    }
  };
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Confirmation
            </ModalHeader>
            <ModalBody>
              <p>{title}</p>
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
                onPress={handleChangeStatus}
                isLoading={loading}
              >
                Update
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ChangeProductStatus;
