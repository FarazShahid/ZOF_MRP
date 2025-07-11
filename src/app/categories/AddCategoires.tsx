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
import { ProductCategorySchema, SupplierSchema } from "../schema/SupplierSchema";
import useInventoryCategoryStore, {
  AddInventoryCategoryOptions,
} from "@/store/useInventoryCategoryStore";

interface AddComponentProps {
  isOpen: boolean;
  isEdit: boolean;
  Id: number;
  closeAddModal: () => void;
}

const AddCategoires: React.FC<AddComponentProps> = ({
  isOpen,
  closeAddModal,
  isEdit,
  Id,
}) => {
  const {
    loading,
    inventoryCategoryById,
    getInventoryCategoryById,
    updateInventoryCategory,
    addInventoryCategory,
  } = useInventoryCategoryStore();

  useEffect(() => {
    if (Id && isEdit) {
      getInventoryCategoryById(Id);
    }
  }, [Id, isEdit]);

  const InitialValues = {
    Name: isEdit && inventoryCategoryById ? inventoryCategoryById.Name : "",
  };

  const handleAdd = async (values: AddInventoryCategoryOptions) => {
    isEdit
      ? updateInventoryCategory(Id, values, () => {
          closeAddModal();
        })
      : addInventoryCategory(values, () => {
          closeAddModal();
        });
  };

  return (
    <Modal isOpen={isOpen} size="lg" onOpenChange={closeAddModal}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {!isEdit ? <> Add Category</> : <> Edit Category</>}
            </ModalHeader>
            <Formik
              validationSchema={ProductCategorySchema}
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
                            <label className="text-sm text-gray-600 font-sans">
                              Name
                              <span className="text-red-500 text-sm">*</span>
                            </label>
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

export default AddCategoires;
