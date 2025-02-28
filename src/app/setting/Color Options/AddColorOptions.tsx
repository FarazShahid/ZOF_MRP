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
import useColorOptionsStore from "@/store/useColorOptionsStore";
import { ColorOptionSchema } from "../../schema/ColorOptionSchema";

interface AddClientComponentProps {
  isOpen: boolean;
  isEdit: boolean;
  colorId: number;
  closeAddModal: () => void;
}

const AddColorOptions: React.FC<AddClientComponentProps> = ({
  isOpen,
  closeAddModal,
  isEdit,
  colorId,
}) => {
  interface AddColorOptionType {
    Name: string;
    CreatedBy: string;
    UpdatedBy: string;
  }

  const {
    colorOption,
    loading,
    addColorOption,
    updateColorOption,
    getColorOptionId,
  } = useColorOptionsStore();

  useEffect(() => {
    if (colorId && isEdit) {
      getColorOptionId(colorId);
    }
  }, [colorId, isEdit]);

  const InitialValues = {
    Name: isEdit && colorOption ? colorOption.Name : "",
    CreatedBy: isEdit && colorOption ? colorOption.CreatedBy : "admin",
    UpdatedBy: isEdit && colorOption ? colorOption.UpdatedBy : "admin",
  };

  const handleAddFabric = async (values: AddColorOptionType) => {
    isEdit
      ? updateColorOption(colorId, values, () => {
          closeAddModal();
        })
      : addColorOption(values, () => {
          closeAddModal();
        });
  };

  return (
    <Modal isOpen={isOpen} size="lg" onOpenChange={closeAddModal}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {!isEdit ? <> Add Color Option</> : <> Edit Color Option</>}
            </ModalHeader>
            <Formik
              validationSchema={ColorOptionSchema}
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
                            <label className="text-sm text-gray-600 font-sans">
                              Name
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              name="Name"
                              type="text"
                              placeholder="Enter Type"
                              className="formInputdefault"
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
                      {isEdit ? "Edit" : "Add"} Color Option
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

export default AddColorOptions;
