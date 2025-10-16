import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import useRoleRightsStore from "@/store/useRoleRightsStore";

interface DeleteRoleProps {
  isOpen: boolean;
  onClose: () => void;
  id: number;
}

const DeleteRole: React.FC<DeleteRoleProps> = ({ isOpen, onClose, id }) => {
  const { deleteRole, loading } = useRoleRightsStore();

  const handleDelete = async () => {
    try {
      await deleteRole(id, () => {
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
              <p>Are you sure you want to delete this role?</p>
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
              <Button color="primary" onPress={handleDelete} isLoading={loading}>
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DeleteRole;


