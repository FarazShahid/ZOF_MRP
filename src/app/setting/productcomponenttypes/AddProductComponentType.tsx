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
import { ErrorMessage, Field, Form, Formik } from "formik";

import Label from "../../components/common/Label";
import { ProductComponentTypeSchema } from "../../schema/ProductComponentTypeSchema";
import useProductComponentTypesStore from "@/store/useProductComponentTypesStore";

interface AddProductComponentTypeProps {
  isOpen: boolean;
  isEdit: boolean;
  componentTypeId: number;
  closeAddModal: () => void;
}

const AddProductComponentType: React.FC<AddProductComponentTypeProps> = ({
  isOpen,
  isEdit,
  componentTypeId,
  closeAddModal,
}) => {
  const {
    addProductComponentType,
    updateProductComponentType,
    getProductComponentTypeById,
    productComponentType,
    loading,
  } = useProductComponentTypesStore();

  useEffect(() => {
    if (componentTypeId && isEdit) {
      getProductComponentTypeById(componentTypeId);
    }
  }, [componentTypeId, getProductComponentTypeById, isEdit]);

  const initialValues = {
    name: isEdit && productComponentType ? productComponentType.name : "",
  };

  const handleSubmit = async (values: { name: string }) => {
    if (isEdit) {
      await updateProductComponentType(componentTypeId, values, closeAddModal);
      return;
    }

    await addProductComponentType(values, closeAddModal);
  };

  return (
    <Modal isOpen={isOpen} size="lg" onOpenChange={closeAddModal}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {isEdit ? "Edit Component Type" : "Add Component Type"}
            </ModalHeader>
            <Formik
              validationSchema={ProductComponentTypeSchema}
              initialValues={initialValues}
              enableReinitialize
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <ModalBody>
                    {loading ? (
                      <Spinner />
                    ) : (
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex w-full flex-col gap-1">
                          <Label
                            isRequired={true}
                            label="Name"
                            labelForm="Name"
                          />
                          <Field
                            name="name"
                            type="text"
                            maxLength={255}
                            placeholder="Enter component type name"
                            className="formInputdefault bg-gray-100"
                          />
                          <ErrorMessage
                            name="name"
                            component="div"
                            className="text-sm text-red-400"
                          />
                        </div>
                      </div>
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
                      color="primary"
                      type="submit"
                      isLoading={isSubmitting}
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

export default AddProductComponentType;
