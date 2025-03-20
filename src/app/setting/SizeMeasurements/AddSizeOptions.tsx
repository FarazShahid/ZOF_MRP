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
import { Field, Formik, Form, ErrorMessage } from "formik";
import useSizeOptionsStore from "@/store/useSizeOptionsStore";
import useSizeMeasurementsStore, {
  AddSizeMeasurementType,
} from "@/store/useSizeMeasurementsStore";
import { SizeMeasurementSchema } from "../../schema/SizeMeasurementSchema";

interface AddClientComponentProps {
  isOpen: boolean;
  isEdit: boolean;
  sizeId: number;
  closeAddModal: () => void;
}

const AddSizeOptions: React.FC<AddClientComponentProps> = ({
  isOpen,
  closeAddModal,
  isEdit,
  sizeId,
}) => {
  const { fetchsizeOptions, sizeOptions } = useSizeOptionsStore();
  const {
    loading,
    addSizeMeasurement,
    updateMeasurement,
    getSizeMeasurementById,
    sizeMeasurementById,
  } = useSizeMeasurementsStore();

  useEffect(() => {
    if (sizeId && isEdit) {
      getSizeMeasurementById(sizeId);
    }
  }, [sizeId, isEdit]);

  useEffect(() => {
    fetchsizeOptions();
  }, []);

  const InitialValues = {
    SizeOptionId:
      isEdit && sizeMeasurementById ? sizeMeasurementById.SizeOptionId : 0,
    Measurement1:
      isEdit && sizeMeasurementById ? sizeMeasurementById.Measurement1 : "",
    FrontLengthHPS:
      isEdit && sizeMeasurementById ? sizeMeasurementById.FrontLengthHPS : "",
    BackLengthHPS:
      isEdit && sizeMeasurementById ? sizeMeasurementById.BackLengthHPS : "",
    AcrossShoulders:
      isEdit && sizeMeasurementById ? sizeMeasurementById.AcrossShoulders : "",
    ArmHole: isEdit && sizeMeasurementById ? sizeMeasurementById.ArmHole : "",
    UpperChest:
      isEdit && sizeMeasurementById ? sizeMeasurementById.UpperChest : "",
    LowerChest:
      isEdit && sizeMeasurementById ? sizeMeasurementById.LowerChest : "",
    Waist: isEdit && sizeMeasurementById ? sizeMeasurementById.Waist : "",
    BottomWidth:
      isEdit && sizeMeasurementById ? sizeMeasurementById.BottomWidth : "",
    SleeveLength:
      isEdit && sizeMeasurementById ? sizeMeasurementById.SleeveLength : "",
    SleeveOpening:
      isEdit && sizeMeasurementById ? sizeMeasurementById.SleeveOpening : "",
    NeckSize: isEdit && sizeMeasurementById ? sizeMeasurementById.NeckSize : "",
    CollarHeight:
      isEdit && sizeMeasurementById ? sizeMeasurementById.CollarHeight : "",
    CollarPointHeight:
      isEdit && sizeMeasurementById
        ? sizeMeasurementById.CollarPointHeight
        : "",
    StandHeightBack:
      isEdit && sizeMeasurementById ? sizeMeasurementById.StandHeightBack : "",
    CollarStandLength:
      isEdit && sizeMeasurementById
        ? sizeMeasurementById.CollarStandLength
        : "",
    SideVentFront:
      isEdit && sizeMeasurementById ? sizeMeasurementById.SideVentFront : "",
    SideVentBack:
      isEdit && sizeMeasurementById ? sizeMeasurementById.SideVentBack : "",
    PlacketLength:
      isEdit && sizeMeasurementById ? sizeMeasurementById.PlacketLength : "",
    TwoButtonDistance:
      isEdit && sizeMeasurementById
        ? sizeMeasurementById.TwoButtonDistance
        : "",
    PlacketWidth:
      isEdit && sizeMeasurementById ? sizeMeasurementById.PlacketWidth : "",
    BottomHem:
      isEdit && sizeMeasurementById ? sizeMeasurementById.BottomHem : "",
  };

  const handleAddSizeOption = async (values: AddSizeMeasurementType) => {
    isEdit
      ? updateMeasurement(sizeId, values, () => {
          closeAddModal();
        })
      : addSizeMeasurement(values, () => {
          closeAddModal();
        });
  };


  console.log("sizeId", sizeId);
  return (
    <Modal isOpen={isOpen} size="5xl" onOpenChange={closeAddModal}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {!isEdit ? (
                <> Add Size Measurement</>
              ) : (
                <> Edit Size Measurement</>
              )}
            </ModalHeader>
            <Formik
              validationSchema={SizeMeasurementSchema}
              initialValues={InitialValues}
              enableReinitialize
              onSubmit={handleAddSizeOption}
            >
              {({ isSubmitting }) => (
                <Form>
                  <ModalBody>
                    {loading ? (
                      <Spinner />
                    ) : (
                      <>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-600 font-sans">
                              Name
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              name="Measurement1"
                              type="text"
                              placeholder="Enter Name"
                              className="formInputdefault border-1"
                            />
                            <ErrorMessage
                              name="Measurement1"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-600 font-sans">
                              Size Option
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              name="SizeOptionId"
                              as="select"
                              type="text"
                              className="formInputdefault border-1"
                            >
                              <option value={""}>Select an option</option>
                              {sizeOptions.map((size) => {
                                return (
                                  <option value={size.Id} key={size.Id}>
                                    {size.OptionSizeOptions}
                                  </option>
                                );
                              })}
                            </Field>
                            <ErrorMessage
                              name="SizeOption"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-2 bg-gray-50 rounded p-1">
                          <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-600 font-sans">
                              Front Length HPS
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              name="FrontLengthHPS"
                              type="text"
                              placeholder="Enter Front Length HPS"
                              className="formInputdefault border-1"
                            />
                            <ErrorMessage
                              name="FrontLengthHPS"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-600 font-sans">
                              Back Length HPS
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              name="BackLengthHPS"
                              type="text"
                              placeholder="Enter Back Length HPS"
                              className="formInputdefault border-1"
                            />
                            <ErrorMessage
                              name="BackLengthHPS"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-600 font-sans">
                              Across Shoulders
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              name="AcrossShoulders"
                              type="text"
                              placeholder="Enter Across Shoulders"
                              className="formInputdefault border-1"
                            />
                            <ErrorMessage
                              name="AcrossShoulders"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-600 font-sans">
                              Arm Hole
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              name="ArmHole"
                              type="text"
                              placeholder="Enter Arm Hole"
                              className="formInputdefault border-1"
                            />
                            <ErrorMessage
                              name="ArmHole"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-600 font-sans">
                              Upper Chest
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              name="UpperChest"
                              type="text"
                              placeholder="Enter Upper Chest"
                              className="formInputdefault border-1"
                            />
                            <ErrorMessage
                              name="UpperChest"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-600 font-sans">
                              Lower Chest
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              name="LowerChest"
                              type="text"
                              placeholder="Enter Lower Chest"
                              className="formInputdefault border-1"
                            />
                            <ErrorMessage
                              name="LowerChest"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-600 font-sans">
                              Waist
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              name="Waist"
                              type="text"
                              placeholder="Enter Waist"
                              className="formInputdefault border-1"
                            />
                            <ErrorMessage
                              name="Waist"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-600 font-sans">
                              Bottom Width
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              name="BottomWidth"
                              type="text"
                              placeholder="Enter Bottom Width"
                              className="formInputdefault border-1"
                            />
                            <ErrorMessage
                              name="BottomWidth"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-600 font-sans">
                              Sleeve Length
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              name="SleeveLength"
                              type="text"
                              placeholder="Enter Sleeve Length"
                              className="formInputdefault border-1"
                            />
                            <ErrorMessage
                              name="SleeveLength"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-600 font-sans">
                              Sleeve Opening
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              name="SleeveOpening"
                              type="text"
                              placeholder="Enter Sleeve Opening"
                              className="formInputdefault border-1"
                            />
                            <ErrorMessage
                              name="SleeveOpening"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-600 font-sans">
                              Neck Size
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              name="NeckSize"
                              type="text"
                              placeholder="Enter Neck Size"
                              className="formInputdefault border-1"
                            />
                            <ErrorMessage
                              name="NeckSize"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-600 font-sans">
                              Collar Height
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              name="CollarHeight"
                              type="text"
                              placeholder="Enter Collar Height"
                              className="formInputdefault border-1"
                            />
                            <ErrorMessage
                              name="CollarHeight"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-600 font-sans">
                              Collar Point Height
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              name="CollarPointHeight"
                              type="text"
                              placeholder="Enter Collar Point Height"
                              className="formInputdefault border-1"
                            />
                            <ErrorMessage
                              name="CollarPointHeight"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-600 font-sans">
                              Stand Height Back
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              name="StandHeightBack"
                              type="text"
                              placeholder="Enter Stand Height Back"
                              className="formInputdefault border-1"
                            />
                            <ErrorMessage
                              name="StandHeightBack"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-600 font-sans">
                              Collar Stand Length
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              name="CollarStandLength"
                              type="text"
                              placeholder="Enter Collar Stand Length"
                              className="formInputdefault border-1"
                            />
                            <ErrorMessage
                              name="CollarStandLength"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-600 font-sans">
                              Side Vent Front
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              name="SideVentFront"
                              type="text"
                              placeholder="Enter Side Vent Front"
                              className="formInputdefault border-1"
                            />
                            <ErrorMessage
                              name="SideVentFront"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-600 font-sans">
                              Side Vent Back
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              name="SideVentBack"
                              type="text"
                              placeholder="Enter  Side Vent Back"
                              className="formInputdefault border-1"
                            />
                            <ErrorMessage
                              name="SideVentBack"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-600 font-sans">
                              Placket Length
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              name="PlacketLength"
                              type="text"
                              placeholder="Enter Placket Length"
                              className="formInputdefault border-1"
                            />
                            <ErrorMessage
                              name="PlacketLength"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-600 font-sans">
                              Two Button Distance
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              name="TwoButtonDistance"
                              type="text"
                              placeholder="Enter Two Button Distance"
                              className="formInputdefault border-1"
                            />
                            <ErrorMessage
                              name="TwoButtonDistance"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-600 font-sans">
                              Placket Width
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              name="PlacketWidth"
                              type="text"
                              placeholder="Enter Placket Width"
                              className="formInputdefault border-1"
                            />
                            <ErrorMessage
                              name="PlacketWidth"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-600 font-sans">
                              Bottom Hem
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              name="BottomHem"
                              type="text"
                              placeholder="Enter Bottom Hem"
                              className="formInputdefault border-1"
                            />
                            <ErrorMessage
                              name="BottomHem"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="danger"
                      variant="flat"
                      onPress={closeAddModal}
                    >
                      Cancel
                    </Button>
                    <Button
                      isLoading={isSubmitting}
                      color="primary"
                      type="submit"
                    >
                      {isEdit ? "Edit" : "Add"} Size Option
                    </Button>
                  </ModalFooter>
                </Form>
              )}
            </Formik>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AddSizeOptions;
