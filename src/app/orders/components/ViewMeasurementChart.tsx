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
                <div className="w-[70%]">
                  <div className="w-full h-full dark:text-gray-100 text-gray-800">
                    {/* <ShirtAndShortsModal /> */}
                    <Image src={MeasurementChart} alt="modal" />
                  </div>
                </div>
                <div className="w-[30%] p-2">
                  {/* <h3 className="mb-5 flex items-center gap-2">
                    <CiRuler /> Measurements: (inches)
                  </h3> */}

                  {productCategory?.IsTopUnit && (
                    <div className="w-full  flex justify-between gap-1">
                      <div className="flex flex-col">
                        <div className="whitespace-nowrap">Neck Size</div>
                        <div className="whitespace-nowrap">Collar Height</div>
                        <div className="whitespace-nowrap">Upper Chest</div>
                        <div className=" whitespace-nowrap">Lower Chest</div>
                        <div className="whitespace-nowrap">
                          Across Shoulders
                        </div>
                        <div className="whitespace-nowrap">Sleeve Length</div>
                        <div className="whitespace-nowrap">Sleeve Opening</div>
                        <div className="whitespace-nowrap">Arm Hole</div>
                        <div className="whitespace-nowrap">
                          Front Length HPS
                        </div>
                        <div className="whitespace-nowrap">Back Length HPS</div>
                        <div className="whitespace-nowrap">Side Vent Front</div>
                        <div className="whitespace-nowrap">Side Vent Back</div>
                        <div className="whitespace-nowrap">Bottom Hem</div>
                        <div className="whitespace-nowrap">Bottom Width</div>
                      </div>
                      <div className="flex flex-col text-end">
                        <div className="whitespace-nowrap">
                          {formatNumber(Number(sizeMeasurementById?.NeckSize))}
                        </div>
                        <div className="whitespace-nowrap">
                          {formatNumber(
                            Number(sizeMeasurementById?.CollarHeight)
                          )}
                        </div>
                        <div className="whitespace-nowrap">
                          {formatNumber(
                            Number(sizeMeasurementById?.UpperChest)
                          )}
                        </div>
                        <div className="whitespace-nowrap">
                          {formatNumber(
                            Number(sizeMeasurementById?.LowerChest)
                          )}
                        </div>
                        <div className="whitespace-nowrap">
                          {formatNumber(
                            Number(sizeMeasurementById?.AcrossShoulders)
                          )}
                        </div>
                        <div className="whitespace-nowrap">
                          {formatNumber(
                            Number(sizeMeasurementById?.SleeveLength)
                          )}
                        </div>
                        <div className="whitespace-nowrap">
                          {formatNumber(
                            Number(sizeMeasurementById?.SleeveOpening)
                          )}
                        </div>
                        <div className="whitespace-nowrap">
                          {formatNumber(Number(sizeMeasurementById?.ArmHole))}
                        </div>

                        <div className="whitespace-nowrap">
                          {formatNumber(
                            Number(sizeMeasurementById?.FrontLengthHPS)
                          )}
                        </div>
                        <div className="whitespace-nowrap">
                          {formatNumber(
                            Number(sizeMeasurementById?.BackLengthHPS)
                          )}
                        </div>
                        <div className="whitespace-nowrap">
                          {formatNumber(
                            Number(sizeMeasurementById?.SideVentFront)
                          )}
                        </div>
                        <div className="whitespace-nowrap">
                          {formatNumber(
                            Number(sizeMeasurementById?.SideVentBack)
                          )}
                        </div>
                        <div className="whitespace-nowrap">
                          {formatNumber(Number(sizeMeasurementById?.BottomHem))}
                        </div>
                        <div className="whitespace-nowrap">
                          {formatNumber(
                            Number(sizeMeasurementById?.BottomWidth)
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                   {productCategory?.IsBottomUnit && (
                    <div className="w-full  flex justify-between gap-1">
                      <div className="flex flex-col">
                        <div className="whitespace-nowrap">Hip</div>
                        <div className="whitespace-nowrap">Waist</div>
                        <div className="whitespace-nowrap">Wasit Stretch</div>
                        <div className=" whitespace-nowrap">Wasit Relax</div>
                        <div className="whitespace-nowrap">
                          Thigh
                        </div>
                        <div className="whitespace-nowrap">Knee Width</div>
                        <div className="whitespace-nowrap">Back Rise</div>
                        <div className="whitespace-nowrap">Front Rise</div>
                        <div className="whitespace-nowrap">
                          Total Length
                        </div>
                        <div className="whitespace-nowrap">WB-Height</div>
                        <div className="whitespace-nowrap">Bottom Width</div>
                        <div className="whitespace-nowrap">Hem Bottom</div>
                        <div className="whitespace-nowrap">Bottom Original</div>
                        <div className="whitespace-nowrap">Bottom Elastic</div>
                        <div className="whitespace-nowrap">Outseam</div>
                         <div className="whitespace-nowrap">Inseam</div>
                         <div className="whitespace-nowrap">Leg Opening</div>
                         <div className="whitespace-nowrap">Bottom Cuff Zipped</div>
                         <div className="whitespace-nowrap">Bottom Straight Zipped</div>
                      </div>
                      <div className="flex flex-col text-end">
                        <div className="whitespace-nowrap">
                          {formatNumber(Number(sizeMeasurementById?.Hip))}
                        </div>
                        <div className="whitespace-nowrap">
                          {formatNumber(
                            Number(sizeMeasurementById?.Waist)
                          )}
                        </div>
                        <div className="whitespace-nowrap">
                          {formatNumber(
                            Number(sizeMeasurementById?.WasitStretch)
                          )}
                        </div>
                        <div className="whitespace-nowrap">
                          {formatNumber(
                            Number(sizeMeasurementById?.WasitRelax)
                          )}
                        </div>
                        <div className="whitespace-nowrap">
                          {formatNumber(
                            Number(sizeMeasurementById?.Thigh)
                          )}
                        </div>
                        <div className="whitespace-nowrap">
                          {formatNumber(
                            Number(sizeMeasurementById?.KneeWidth)
                          )}
                        </div>
                        <div className="whitespace-nowrap">
                          {formatNumber(
                            Number(sizeMeasurementById?.BackRise)
                          )}
                        </div>
                        <div className="whitespace-nowrap">
                          {formatNumber(Number(sizeMeasurementById?.bFrontRise))}
                        </div>

                        <div className="whitespace-nowrap">
                          {formatNumber(
                            Number(sizeMeasurementById?.TotalLength)
                          )}
                        </div>
                        <div className="whitespace-nowrap">
                          {formatNumber(
                            Number(sizeMeasurementById?.WBHeight)
                          )}
                        </div>
                        <div className="whitespace-nowrap">
                          {formatNumber(
                            Number(sizeMeasurementById?.bBottomWidth)
                          )}
                        </div>
                        <div className="whitespace-nowrap">
                          {formatNumber(
                            Number(sizeMeasurementById?.HemBottom)
                          )}
                        </div>
                        <div className="whitespace-nowrap">
                          {formatNumber(Number(sizeMeasurementById?.BottomOriginal))}
                        </div>
                        <div className="whitespace-nowrap">
                          {formatNumber(
                            Number(sizeMeasurementById?.BottomElastic)
                          )}
                        </div>
                         <div className="whitespace-nowrap">
                          {formatNumber(
                            Number(sizeMeasurementById?.Outseam)
                          )}
                        </div>
                        <div className="whitespace-nowrap">
                          {formatNumber(
                            Number(sizeMeasurementById?.Inseam)
                          )}
                        </div>
                         <div className="whitespace-nowrap">
                          {formatNumber(
                            Number(sizeMeasurementById?.LegOpening)
                          )}
                        </div>
                         <div className="whitespace-nowrap">
                          {formatNumber(
                            Number(sizeMeasurementById?.BottomCuffZipped)
                          )}
                        </div>
                          <div className="whitespace-nowrap">
                          {formatNumber(
                            Number(sizeMeasurementById?.BottomStraightZipped)
                          )}
                        </div>
                      </div>
                    </div>
                  )}
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
