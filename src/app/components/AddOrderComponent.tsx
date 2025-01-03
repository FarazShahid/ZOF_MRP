import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  useDisclosure,
} from "@nextui-org/react";

interface AddOrderComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderAdded: () => void; // Callback for successful order addition
}

const AddOrderComponent: React.FC<AddOrderComponentProps> = ({
  isOpen,
  onClose,
  onOrderAdded,
}) => {
  return (
    <Modal isOpen={isOpen} size="5xl" onOpenChange={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Add New Order
            </ModalHeader>
            <ModalBody></ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary">Add Order</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AddOrderComponent;
