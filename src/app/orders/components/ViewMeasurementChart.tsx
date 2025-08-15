import { useEffect } from "react";
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
import { CiRuler } from "react-icons/ci";
import { formatNumber } from "@/interface";
import ShirtAndShortsModal from "@/public/svgs/ShirtAndShortsModal";
import Image from "next/image";
import MeasurementChart from "@/public/MeasurementChart.png";
import useCategoryStore from "@/store/useCategoryStore";
import MeasurementTables from "./MeasurementTable";

interface ComponentProps {
  isOpen: boolean;
  measurementId: number;
  sizeOptionName: string;
  onCloseViewModal: () => void;
}

export const ViewMeasurementChart: React.FC<ComponentProps> = ({
  isOpen,
  measurementId,
  sizeOptionName,
  onCloseViewModal,
}) => {
  const { getSizeMeasurementById, sizeMeasurementById, loading } =
    useSizeMeasurementsStore();
  const { getCategoryById, productCategory } = useCategoryStore();

  useEffect(() => {
    if (measurementId) {
      getSizeMeasurementById(measurementId);
    }
  }, [measurementId]);

  useEffect(() => {
    if (sizeMeasurementById) {
      getCategoryById(sizeMeasurementById.ProductCategoryId);
    }
  }, [sizeMeasurementById]);

  if (loading) {
    return (
      <Modal isOpen={isOpen} size="lg" onOpenChange={onCloseViewModal}>
        <ModalContent>
          <ModalHeader>Loading...</ModalHeader>
          <ModalBody>
            <div className="flex justify-center items-center">
              <Spinner />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} size="4xl" onOpenChange={onCloseViewModal}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader>
              {sizeOptionName}_{sizeMeasurementById?.Measurement1}
            </ModalHeader>
            <ModalBody>
              <div className="flex gap-3 w-full px-5 h-[calc(100vh-300px)]">
                <div className="w-[60%]">
                  <Image src={MeasurementChart} alt="modal" />
                </div>
                <div className="w-[40%] p-2">
                  <MeasurementTables
                    productCategory={productCategory}
                    measurement={sizeMeasurementById}
                    useTabs={true}
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <div className="flex items-end">
                <Button
                  color="danger"
                  variant="flat"
                  onPress={onCloseViewModal}
                >
                  Close
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
