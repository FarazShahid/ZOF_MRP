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
import Label from "../../components/common/Label";

interface AddClientComponentProps {
  isOpen: boolean;
  isEdit: boolean;
  cutOptionId: number;
  closeAddModal: () => void;
}

const AddCutOptions: React.FC<AddClientComponentProps> = ({
  isOpen,
  closeAddModal,
  isEdit,
  cutOptionId,
}) => {
  interface AddCutOptionsType {
    OptionProductCutOptions: string;
    CreatedBy: string;
    UpdatedBy: string;
  }

  const {
    getCutOptionById,
    updateCutOption,
    addCutOption,
    cutOptionsType,
    loading,
  } = useCutOptionsStore();

  useEffect(() => {
    if (cutOptionId && isEdit) {
      getCutOptionById(cutOptionId);
    }
  }, [cutOptionId, isEdit]);

  const InitialValues = {
    OptionProductCutOptions:
      isEdit && cutOptionsType ? cutOptionsType.OptionProductCutOptions : "",
    CreatedBy: isEdit && cutOptionsType ? cutOptionsType.CreatedBy : "Admin",
    UpdatedBy: isEdit && cutOptionsType ? cutOptionsType.UpdatedBy : "Admin",
  };

  const handleAdd = async (values: AddCutOptionsType) => {
    isEdit
      ? updateCutOption(cutOptionId, values, () => {
          closeAddModal();
        })
      : addCutOption(values, () => {
          closeAddModal();
        });
  };

  return (
    <Modal isOpen={isOpen} size="lg" onOpenChange={closeAddModal}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {!isEdit ? <> Add Cut Option</> : <> Edit Cut Option</>}
            </ModalHeader>
            <Formik
              validationSchema={CutOptionSchema}
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
                            <Label isRequired={true} label="Name" labelForm="Name" />
                            <Field
                              name="OptionProductCutOptions"
                              type="text"
                              placeholder="Enter Cut Option Name"
                              className="formInputdefault"
                            />
                            <ErrorMessage
                              name="OptionProductCutOptions"
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

export default AddCutOptions;
