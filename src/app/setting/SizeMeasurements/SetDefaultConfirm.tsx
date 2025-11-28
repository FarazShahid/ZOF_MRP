import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import useSizeMeasurementsStore from "@/store/useSizeMeasurementsStore";

interface SetDefaultConfirmProps {
  isOpen: boolean;
  measurementId: number | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const SetDefaultConfirm: React.FC<SetDefaultConfirmProps> = ({
  isOpen,
  measurementId,
  onClose,
  onSuccess,
}) => {
  const { setAsDefault } = useSizeMeasurementsStore();
  const [saving, setSaving] = useState<boolean>(false);

  const handleConfirm = async () => {
    if (!measurementId) {
      onClose();
      return;
    }
    try {
      setSaving(true);
      await setAsDefault(measurementId, onSuccess);
    } finally {
      setSaving(false);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" placement="center">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Confirm Set as Default
        </ModalHeader>
        <ModalBody>
          <p className="text-sm text-default-600">
            Are you sure you want to set this size measurement as the default?
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onClick={onClose} isDisabled={saving}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleConfirm} isLoading={saving} isDisabled={saving}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SetDefaultConfirm;


