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
import useInventoryCategoryStore from "@/store/useInventoryCategoryStore";
import useInventorySubCategoryStore, {
  AddSubCategoryOptions,
} from "@/store/useInventorySubCategoryStore";
import { SubCategorySchema } from "../schema/SubCategorySchema";

interface AddComponentProps {
  isOpen: boolean;
  isEdit: boolean;
  Id: number;
  closeAddModal: () => void;
}

const AddSubCategory: React.FC<AddComponentProps> = ({
  isOpen,
  closeAddModal,
  isEdit,
  Id,
}) => {
  const {
    loading,
    subCategoryById,
    getSubCategoryById,
    updateSubCategory,
    addSubCategory,
  } = useInventorySubCategoryStore();

  const { fetchInventoryCategories, inventoryCategories } =
    useInventoryCategoryStore();

  useEffect(() => {
    if (Id && isEdit) {
      getSubCategoryById(Id);
    }
  }, [Id, isEdit]);

  const InitialValues = {
    Name: isEdit && subCategoryById ? subCategoryById.Name : "",
    CategoryId: isEdit && subCategoryById ? subCategoryById.CategoryId : 0,
  };

  useEffect(() => {
    fetchInventoryCategories();
  }, []);

  const handleAdd = async (values: AddSubCategoryOptions) => {
    isEdit
      ? updateSubCategory(Id, values, () => {
          closeAddModal();
        })
      : addSubCategory(values, () => {
          closeAddModal();
        });
  };

  return (
    <Modal isOpen={isOpen} size="lg" onOpenChange={closeAddModal}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {!isEdit ? <> Add Sub Category</> : <> Edit Sub Category</>}
            </ModalHeader>
            <Formik
              validationSchema={SubCategorySchema}
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
                            <label className="text-sm text-gray-600 font-sans">
                              Category
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              name="CategoryId"
                              as="select"
                               className="formInputdefault border-1"
                            >
                              <option value={""}>Select a category</option>
                              {inventoryCategories?.map((category, index) => {
                                return (
                                  <option value={category?.Id} key={index}>
                                    {category?.Name}
                                  </option>
                                );
                              })}
                            </Field>
                            <ErrorMessage
                              name="CategoryId"
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

export default AddSubCategory;
