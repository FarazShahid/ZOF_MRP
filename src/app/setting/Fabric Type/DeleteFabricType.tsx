import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
  } from "@heroui/react";
  import useCategoryStore from "@/store/useCategoryStore";
import useFabricStore from "@/store/useFabricStore";
  
  interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    productIdCatagory: number;
  }
  
  const DeleteFabricType: React.FC<DeleteModalProps> = ({
    isOpen,
    onClose,
    productIdCatagory,
  }) => {
    const {deleteFabricType, loading} = useFabricStore();
  
    const handleDelete = async () => {
      try {
        await deleteFabricType(productIdCatagory, () => {
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
                <p>Are you sure you want to delete this Type?</p>
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
  
  export default DeleteFabricType;
  