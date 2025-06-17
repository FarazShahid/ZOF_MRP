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
import useCutOptionsStore from "@/store/useCutOptionsStore";
import { CutOptionSchema } from "../../schema/CutOptionSchema";
import usePrintingOptionsStore, {
  AddPrintingOptionsType,
} from "@/store/usePrintingOptionsStore";
import { PrintingOptionSchema } from "../../schema/PrintingOptionSchema";
import Label from "../../components/common/Label";

interface AddClientComponentProps {
  isOpen: boolean;
  isEdit: boolean;
  printingOptionId: number;
  closeAddModal: () => void;
}

const AddPrintingOptions: React.FC<AddClientComponentProps> = ({
  isOpen,
  closeAddModal,
  isEdit,
  printingOptionId,
}) => {

  const {
    loading,
    printingOptionById,
    getPrintingOptionById,
    addPrintingOption,
    updatePrintingOption,
  } = usePrintingOptionsStore();

  useEffect(() => {
    if (printingOptionId && isEdit) {
      getPrintingOptionById(printingOptionId);
    }
  }, [printingOptionId, isEdit]);

  const InitialValues = {
    Name: isEdit && printingOptionById ? printingOptionById.Name : "",
  };

  const handleAdd = async (values: AddPrintingOptionsType) => {
    isEdit
      ? updatePrintingOption(printingOptionId, values, () => {
          closeAddModal();
        })
      : addPrintingOption(values, () => {
          closeAddModal();
        });
  };

  return (
    <Modal isOpen={isOpen} size="lg" onOpenChange={closeAddModal}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {!isEdit ? <> Add Printing Option</> : <> Edit Printing Option</>}
            </ModalHeader>
            <Formik
              validationSchema={PrintingOptionSchema}
              initialValues={InitialValues}
              enableReinitialize
              onSubmit={handleAdd}
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
                            <Label isRequired={true} label="Name" />
                            <Field
                              name="Name"
                              type="text"
                              placeholder="Enter Printing Option"
                              className="formInputdefault bg-gray-100"
                            />
                            <ErrorMessage
                              name="Name"
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

export default AddPrintingOptions;
