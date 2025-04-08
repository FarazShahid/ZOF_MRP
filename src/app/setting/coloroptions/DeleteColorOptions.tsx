import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
  } from "@heroui/react";
  import useCategoryStore from "@/store/useCategoryStore";
import useColorOptionsStore from "@/store/useColorOptionsStore";
  
  interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    colorId: number;
  }
  
  const DeleteColorOptions: React.FC<DeleteModalProps> = ({
    isOpen,
    onClose,
    colorId,
  }) => {
    
    const {loading, deleteColorOption} = useColorOptionsStore();
  
    const handleDelete = async () => {
      try {
        await deleteColorOption(colorId, () => {
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
                <p>Are you sure you want to delete this Color Option?</p>
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
  
  export default DeleteColorOptions;
  