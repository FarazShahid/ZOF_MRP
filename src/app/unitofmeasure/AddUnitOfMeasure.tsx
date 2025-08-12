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
import { UnitOfMeasureSchema } from "../schema/SupplierSchema";
import useUnitOfMeasureStore, {
  AddUnitOfMeasureType,
} from "@/store/useUnitOfMeasureStore";
import Label from "../components/common/Label";

interface AddComponentProps {
  isOpen: boolean;
  isEdit: boolean;
  Id: number;
  closeAddModal: () => void;
}

const AddUnitOfMeasure: React.FC<AddComponentProps> = ({
  isOpen,
  closeAddModal,
  isEdit,
  Id,
}) => {
  const {
    loading,
    getUnitOfMeasuresById,
    updateUnitOfMeasure,
    addUnitOfMeasure,
    unitMeasureById,
  } = useUnitOfMeasureStore();


  useEffect(() => {
    if (Id && isEdit) {
      getUnitOfMeasuresById(Id);
    }
  }, [Id, isEdit]);

  const InitialValues = {
    Name: isEdit && unitMeasureById ? unitMeasureById.Name : "",
    ShortForm: isEdit && unitMeasureById ? unitMeasureById?.ShortForm : "",
  };

  const handleAdd = async (values: AddUnitOfMeasureType) => {
    isEdit
      ? updateUnitOfMeasure(Id, values, () => {
          closeAddModal();
        })
      : addUnitOfMeasure(values, () => {
          closeAddModal();
        });
  };

  return (
    <Modal isOpen={isOpen} size="lg" onOpenChange={closeAddModal}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {!isEdit ? <> Add</> : <> Edit</>} Unit Of Measure
            </ModalHeader>
            <Formik
              validationSchema={UnitOfMeasureSchema}
              initialValues={InitialValues}
              enableReinitialize
              onSubmit={handleAdd}
            >
              {({ isSubmitting, setFieldValue }) => (
                <Form>
                  <ModalBody>
                    {loading ? (
                      <Spinner />
                    ) : (
                      <>
                        <div className="grid grid-cols-1 gap-3">
                          <div className="flex flex-col gap-1 w-full">
                           <Label isRequired={true}
                               label="Name" 
                               labelForm="Name" />
                            <Field
                              name="Name"
                              type="text"
                              maxLength={100}
                              placeholder="Enter Name"
                              className="formInputdefault border-1"
                            />
                            <ErrorMessage
                              name="Name"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                             <Label isRequired={false}
                               label="Short Form" 
                               labelForm="Short Form" />
                            <Field
                              name="ShortForm"
                              type="text"
                              maxLength={100}
                              placeholder="Enter Short Form"
                              className="formInputdefault border-1"
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

export default AddUnitOfMeasure;
