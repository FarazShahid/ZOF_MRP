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
import { CatagorySchema } from "../../schema/CatagorySchema";
import useCategoryStore from "@/store/useCategoryStore";
import { useEffect } from "react";

interface AddClientComponentProps {
  isOpen: boolean;
  isEdit: boolean;
  productIdCatagory: number;
  closeAddModal: () => void;
}

const AddProductCatagory: React.FC<AddClientComponentProps> = ({
  isOpen,
  closeAddModal,
  isEdit,
  productIdCatagory,
}) => {
  interface AddClientType {
    type: string;
  }

  const {
    productCategory,
    getCategoryById,
    addCategory,
    updateCategory,
    loading,
    isResolved,
  } = useCategoryStore();

  useEffect(() => {
    if (productIdCatagory && isEdit) {
      getCategoryById(productIdCatagory);
    }
  }, [productIdCatagory, isEdit]);

  const InitialValues = {
    type: isEdit && productCategory ? productCategory.type : "",
  };

  const handleAddCatagory = async (values: AddClientType) => {
    isEdit
      ? updateCategory(productIdCatagory, values, () => {
          closeAddModal();
        })
      : addCategory(values, () => {
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
                <> Add Product Category</>
              ) : (
                <> Edit Product Category</>
              )}
            </ModalHeader>
            <Formik
              validationSchema={CatagorySchema}
              initialValues={InitialValues}
              enableReinitialize
              onSubmit={handleAddCatagory}
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
                              name="type"
                              type="text"
                              placeholder="Enter Name"
                              className="formInputdefault"
                            />
                            <ErrorMessage
                              name="type"
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
                      {isEdit ? "Edit" : "Add"} Catagory
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

export default AddProductCatagory;
