import React, { useEffect } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@heroui/react";
import useSizeMeasurementsStore from "@/store/useSizeMeasurementsStore";
import SizeDataView from "./SizeDataView";

interface ComponentProps {
  isOpen: boolean;
  sizeOptionId: number;
  closeAddModal: () => void;
}

const ViewModal: React.FC<ComponentProps> = ({
  isOpen,
  sizeOptionId,
  closeAddModal,
}) => {
  const { getSizeOptionById, loading, sizeMeasurementById } = useSizeMeasurementsStore();

  useEffect(() => {
    if (sizeOptionId) {
      getSizeOptionById(sizeOptionId);
    }
  }, [sizeOptionId]);

  return (
    <Modal isOpen={isOpen} size="4xl" onOpenChange={closeAddModal}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {sizeMeasurementById?.Measurement1}
            </ModalHeader>
            <ModalBody>
              {loading ? (
                <Spinner />
              ) : (
                <div className="chart-grid-container">
                  <SizeDataView label="Front Length HPS" value={sizeMeasurementById?.FrontLengthHPS || ""} />
                  <SizeDataView label="Back Length HPS" value={sizeMeasurementById?.BackLengthHPS || ""} />
                  <SizeDataView label="Across Shoulders" value={sizeMeasurementById?.AcrossShoulders || ""} />
                  <SizeDataView label="Arm Hole" value={sizeMeasurementById?.ArmHole || ""} />
                  <SizeDataView label="Upper Chest" value={sizeMeasurementById?.UpperChest || ""} />
                  <SizeDataView label="Lower Chest" value={sizeMeasurementById?.LowerChest || ""} />
                  <SizeDataView label="Waist" value={sizeMeasurementById?.Waist || ""} />
                  <SizeDataView label="Bottom Width" value={sizeMeasurementById?.BottomWidth || ""} />
                  <SizeDataView label="Sleeve Length" value={sizeMeasurementById?.SleeveLength || ""} />
                  <SizeDataView label="Sleeve Opening" value={sizeMeasurementById?.SleeveOpening || ""} />
                  <SizeDataView label="Neck Size" value={sizeMeasurementById?.NeckSize || ""} />
                  <SizeDataView label="Collar Height" value={sizeMeasurementById?.CollarHeight || ""} />
                  <SizeDataView label="Stand Height Back" value={sizeMeasurementById?.StandHeightBack || ""} />
                  <SizeDataView label="Collar Stand Length" value={sizeMeasurementById?.CollarStandLength || ""} />
                  <SizeDataView label="Side Vent Front" value={sizeMeasurementById?.SideVentFront || ""} />
                  <SizeDataView label="Side Vent Back" value={sizeMeasurementById?.SideVentBack || ""} />
                  <SizeDataView label="Placket Length" value={sizeMeasurementById?.PlacketLength || ""} />
                  <SizeDataView label="Two Button Distance" value={sizeMeasurementById?.TwoButtonDistance || ""} />
                  <SizeDataView label="Placket Width" value={sizeMeasurementById?.PlacketWidth || ""} />
                  <SizeDataView label="Bottom Hem" value={sizeMeasurementById?.BottomHem || ""} />
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={closeAddModal}>
                Cancel
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ViewModal;
