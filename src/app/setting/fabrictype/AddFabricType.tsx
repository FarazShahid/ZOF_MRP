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
import { FabricTypeSchema } from "../../schema/FabricTypeSchema";
import useFabricStore from "@/store/useFabricStore";
import Label from "../../components/common/Label";

interface AddClientComponentProps {
  isOpen: boolean;
  isEdit: boolean;
  fabricTypeId: number;
  closeAddModal: () => void;
}

const AddFabricType: React.FC<AddClientComponentProps> = ({
  isOpen,
  closeAddModal,
  isEdit,
  fabricTypeId,
}) => {
  interface AddFabricType {
    type: string;
    name: string;
    gsm: string;
  }

  const {
    addFabricType,
    updateFabricType,
    getFabricById,
    fabricType,
    loading,
  } = useFabricStore();

  useEffect(() => {
    if (fabricTypeId && isEdit) {
      getFabricById(fabricTypeId);
    }
  }, [fabricTypeId, isEdit]);

  const InitialValues = {
    type: isEdit && fabricType ? fabricType.type : "",
    name: isEdit && fabricType ? fabricType.name : "",
    gsm: isEdit && fabricType ? fabricType.gsm : "",
  };

  const handleAddFabric = async (values: AddFabricType) => {
    isEdit
      ? updateFabricType(fabricTypeId, values, () => {
          closeAddModal();
        })
      : addFabricType(values, () => {
          closeAddModal();
        });
  };

  return (
    <Modal isOpen={isOpen} size="lg" onOpenChange={closeAddModal}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {!isEdit ? <> Add Fabric Type</> : <> Edit Fabric Type</>}
            </ModalHeader>
            <Formik
              validationSchema={FabricTypeSchema}
              initialValues={InitialValues}
              enableReinitialize
              onSubmit={handleAddFabric}
            >
              {({ isSubmitting }) => (
                <Form>
                  <ModalBody>
                    {loading ? (
                      <Spinner />
                    ) : (
                      <>
                        <div className="grid grid-cols-1 gap-3">
                          <div className="flex flex-col gap-1 w-full">
                            <Label
                              isRequired={true}
                              label="Type"
                              labelForm="Type"
                            />
                            <Field
                              name="type"
                              type="text"
                              maxLength={100}
                              placeholder="Enter Type"
                              className="formInputdefault bg-gray-100"
                            />
                            <ErrorMessage
                              name="type"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <Label
                              isRequired={true}
                              label="Name"
                              labelForm="Name"
                            />
                            <Field
                              name="name"
                              type="text"
                              maxLength={100}
                              placeholder="Enter Name"
                              className="formInputdefault bg-gray-100"
                            />
                            <ErrorMessage
                              name="name"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <Label
                              isRequired={true}
                              label="GSM"
                              labelForm="GSM"
                            />
                            <Field
                              name="gsm"
                              type="number"
                              min={0}
                              placeholder="Enter GSM"
                              className="formInputdefault bg-gray-100"
                            />
                            <ErrorMessage
                              name="gsm"
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
                      {isEdit ? "Update" : "Save"}
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

export default AddFabricType;
