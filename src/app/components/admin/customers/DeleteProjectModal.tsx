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
    projectId: number | null;
}

const DeleteProjectModal: React.FC<DeleteModalProps> = ({
    isOpen,
    onClose,
    projectId,
}) => {
    const { loading, deleteProject } = useClientStore();
    const handleDelete = async () => {
        try {
            if (projectId) {
                await deleteProject(projectId, () => {
                    onClose();
                });
            }

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
                            <p>Are you sure you want to delete this Project?</p>
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

export default DeleteProjectModal;
