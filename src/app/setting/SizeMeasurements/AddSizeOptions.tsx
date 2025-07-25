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
import useClientStore from "@/store/useClientStore";
import { SizeMeasurementSchema } from "../../schema/SizeMeasurementSchema";
import Label from "../../components/common/Label";


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
  const {fetchClients, clients} = useClientStore();
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
    fetchClients();
  }, []);

  const InitialValues = {
    SizeOptionId:
      isEdit && sizeMeasurementById ? sizeMeasurementById.SizeOptionId : 0,
      ClientId:  isEdit && sizeMeasurementById ? sizeMeasurementById.ClientId : 0,
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
                        <div className="grid grid-cols-3 gap-3">
                          <div className="flex flex-col gap-1 w-full">
                            <Label isRequired={true} label="Name" labelForm="Name" />
                            <Field
                              name="Measurement1"
                              type="text"
                              maxLength={100}
                              placeholder="Enter Name"
                              className="formInputdefault bg-gray-100"
                            />
                            <ErrorMessage
                              name="Measurement1"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <Label isRequired={true} label="Client" labelForm="Client" />
                            <Field
                              name="ClientId"
                              as="select"
                              type="text"
                              className="formInputdefault bg-gray-100"
                            >
                              <option value={""}>Select a Client</option>
                              {clients?.map((client, index) => {
                                return (
                                  <option value={client?.Id} key={index}>
                                    {client?.Name}
                                  </option>
                                );
                              })}
                            </Field>
                            <ErrorMessage
                              name="ClientId"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <Label isRequired={true} label="Size Option" labelForm="Size Option" />
                            <Field
                              name="SizeOptionId"
                              as="select"
                              type="text"
                              className="formInputdefault bg-gray-100"
                            >
                              <option value={""}>Select an option</option>
                              {sizeOptions?.map((size) => {
                                return (
                                  <option value={size?.Id} key={size?.Id}>
                                    {size?.OptionSizeOptions}
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
                        <div className="grid grid-cols-4 gap-2 border-1 border-gray-700 rounded-lg p-3">
                          <div className="flex flex-col gap-1 w-full">
                            <Label isRequired={true} label="Front Length HPS" labelForm="Front Length HPS" />
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
                            <Label isRequired={true} label="Back Length HPS" labelForm="Back Length HPS" />
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
                            <Label isRequired={true} label="Across Shoulders" labelForm="Across Shoulders" />
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
                             <Label isRequired={true} label="Arm Hole" labelForm="Arm Hole" />
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
                            <Label isRequired={true} label="Upper Chest" labelForm="Upper Chest" />
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
                            <Label isRequired={true} label="Lower Chest" labelForm="Lower Chest" />
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
                            <Label isRequired={true} label="Waist" labelForm="Waist" />
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
                            <Label isRequired={true} label="Bottom Width" labelForm="Bottom Width" />
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
                            <Label isRequired={true} label="Sleeve Length" labelForm="Sleeve Length" />
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
                            <Label isRequired={true} label="Sleeve Opening" labelForm="Sleeve Opening" />
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
                            <Label isRequired={true} label="Neck Size" labelForm="Neck Size" />
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
                            <Label isRequired={true} label="Collar Height" labelForm="Collar Height" />
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
                            <Label isRequired={true} label="Collar Point Height" labelForm="Collar Point Height" />
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
                            <Label isRequired={true} label="Stand Height Back" labelForm="Stand Height Back" />
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
                            <Label isRequired={true} label="Collar Stand Length" labelForm="Collar Stand Length" />
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
                            <Label isRequired={true} label="Side Vent Front" labelForm="Side Vent Front" />
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
                            <Label isRequired={true} label="Side Vent Back" labelForm="Side Vent Back" />
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
                            <Label isRequired={true} label="Placket Length" labelForm="Placket Length" />
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
                             <Label isRequired={true} label="Two Button Distance" labelForm="Two Button Distance" />
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
                            <Label isRequired={true} label="Placket Width" labelForm="Placket Width" />
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
                            <Label isRequired={true} label="Bottom Hem" labelForm="Bottom Hem" />
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
