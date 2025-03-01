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
import { SizeOptionSchema } from "../../schema/SizeOptionSchema";

interface AddClientComponentProps {
  isOpen: boolean;
  isEdit: boolean;
  sizeOptionId: number;
  closeAddModal: () => void;
}

const AddSizeOptions: React.FC<AddClientComponentProps> = ({
  isOpen,
  closeAddModal,
  isEdit,
  sizeOptionId,
}) => {
  interface AddSizeOptionsType {
    OptionSizeOptions: string;
    CreatedBy: string;
    UpdatedBy: string;
  }
  
  const {getSizeOptionById, addSizeOption, updateSizeOption, sizeOptionsType,loading} = useSizeOptionsStore();

  useEffect(() => {
    if (sizeOptionId && isEdit) {
      getSizeOptionById(sizeOptionId);
    }
  }, [sizeOptionId, isEdit]);


  const InitialValues = {
    OptionSizeOptions:  isEdit && sizeOptionsType ? sizeOptionsType.OptionSizeOptions : "",
    CreatedBy: isEdit && sizeOptionsType ? sizeOptionsType.CreatedBy : "Admin",
    UpdatedBy: isEdit && sizeOptionsType ? sizeOptionsType.UpdatedBy : "Admin",
  };

  const handleAddSizeOption = async (values: AddSizeOptionsType) => {
    isEdit
      ? updateSizeOption(sizeOptionId, values, () => {
          closeAddModal();
        })
      : addSizeOption(values, () => {
          closeAddModal();
        });
  };

  return (
    <Modal isOpen={isOpen} size="lg" onOpenChange={closeAddModal}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {!isEdit ? (
                <> Add Size Option</>
              ) : (
                <> Edit Size Option</>
              )}
            </ModalHeader>
            <Formik
              validationSchema={SizeOptionSchema}
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
                        <div className="grid grid-cols-1 gap-3">
                          <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-600 font-sans">
                            Name
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              name="OptionSizeOptions"
                              type="text"
                              placeholder="Enter Size Option Name"
                              className="formInputdefault"
                            />
                            <ErrorMessage
                              name="OptionSizeOptions"
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
