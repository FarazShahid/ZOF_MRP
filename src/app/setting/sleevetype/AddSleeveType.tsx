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
import useCategoryStore from "@/store/useCategoryStore";
import { SleeveTypeSchema } from "../../schema/SleeveTypeSchema";
import useSleeveType from "@/store/useSleeveType";
import Label from "../../components/common/Label";

interface AddClientComponentProps {
  isOpen: boolean;
  isEdit: boolean;
  sleeveTypeId: number;
  closeAddModal: () => void;
}

const AddSleeveType: React.FC<AddClientComponentProps> = ({
  isOpen,
  closeAddModal,
  isEdit,
  sleeveTypeId,
}) => {
  interface AddFabricType {
    sleeveTypeName: string;
    productCategoryId: number;
  }

  const {
    addSleeveType,
    getSleeveTypeById,
    updateSleeveType,
    sleeveType,
    loading,
  } = useSleeveType();
  const { fetchCategories, productCategories } = useCategoryStore();

  useEffect(() => {
    if (sleeveTypeId && isEdit) {
      getSleeveTypeById(sleeveTypeId);
    }
  }, [sleeveTypeId, isEdit]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const InitialValues = {
    sleeveTypeName: isEdit && sleeveType ? sleeveType.sleeveTypeName : "",
    productCategoryId:
      isEdit && sleeveType ? Number(sleeveType.productCategoryId) : 0,
  };

  const handleAddFabric = async (values: AddFabricType) => {
    isEdit
      ? updateSleeveType(sleeveTypeId, values, () => {
          closeAddModal();
        })
      : addSleeveType(values, () => {
          closeAddModal();
        });
  };

  return (
    <Modal isOpen={isOpen} size="lg" onOpenChange={closeAddModal}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {!isEdit ? <> Add Sleeve Type</> : <> Edit Sleeve Type</>}
            </ModalHeader>
            <Formik
              validationSchema={SleeveTypeSchema}
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
                              label="Sleeve Type Name"
                              labelForm="Sleeve Type Name"
                            />
                            <Field
                              name="sleeveTypeName"
                              type="text"
                              maxLength={100}
                              placeholder="Enter Sleeve Type Name"
                              className="formInputdefault bg-gray-100"
                            />
                            <ErrorMessage
                              name="sleeveTypeName"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <Label
                              isRequired={true}
                              label="Product Category"
                              labelForm="Product Category"
                            />
                            <Field
                              name="productCategoryId"
                              as="select"
                              className="formInputdefault bg-gray-100"
                            >
                              <option value={0}>Select a type</option>
                              {productCategories?.map((category, index) => {
                                return (
                                  <option value={category.Id} key={index}>
                                    {category.Type}
                                  </option>
                                );
                              })}
                            </Field>
                            <ErrorMessage
                              name="productCategoryId"
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

export default AddSleeveType;
