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
import useCategoryStore from "@/store/useCategoryStore";
import useProductSubCategoryStore from "@/store/useProductSubCategoryStore";
import { ProductSubCategorySchema } from "../../schema/ProductSubCategorySchema";

interface AddProductSubCategoryProps {
  isOpen: boolean;
  isEdit: boolean;
  productSubCategoryId: number;
  closeAddModal: () => void;
}

const AddProductSubCategory: React.FC<AddProductSubCategoryProps> = ({
  isOpen,
  isEdit,
  productSubCategoryId,
  closeAddModal,
}) => {
  const { fetchCategories, productCategories } = useCategoryStore();
  const {
    addProductSubCategory,
    updateProductSubCategory,
    getProductSubCategoryById,
    productSubCategory,
    loading,
  } = useProductSubCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (productSubCategoryId && isEdit) {
      getProductSubCategoryById(productSubCategoryId);
    }
  }, [getProductSubCategoryById, isEdit, productSubCategoryId]);

  const initialValues = {
    name: isEdit && productSubCategory ? productSubCategory.name : "",
    productCategoryId:
      isEdit && productSubCategory
        ? productSubCategory.productCategoryId
        : "",
  };

  const handleSubmit = async (values: {
    name: string;
    productCategoryId: number | string;
  }) => {
    const payload = {
      name: values.name,
      productCategoryId: Number(values.productCategoryId),
    };

    if (isEdit) {
      await updateProductSubCategory(
        productSubCategoryId,
        payload,
        closeAddModal
      );
      return;
    }

    await addProductSubCategory(payload, closeAddModal);
  };

  return (
    <Modal isOpen={isOpen} size="lg" onOpenChange={closeAddModal}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {isEdit ? "Edit Product Sub Category" : "Add Product Sub Category"}
            </ModalHeader>
            <Formik
              validationSchema={ProductSubCategorySchema}
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
                            placeholder="Enter product sub category name"
                            className="formInputdefault bg-gray-100"
                          />
                          <ErrorMessage
                            name="name"
                            component="div"
                            className="text-sm text-red-400"
                          />
                        </div>
                        <div className="flex w-full flex-col gap-1">
                          <Label
                            isRequired={true}
                            label="Product Category"
                            labelForm="Product Category"
                          />
                          <Field
                            as="select"
                            name="productCategoryId"
                            className="formInputdefault bg-gray-100"
                          >
                            <option value="">Select Product Category</option>
                            {productCategories.map((category) => (
                              <option key={category.Id} value={category.Id}>
                                {category.Type}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage
                            name="productCategoryId"
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

export default AddProductSubCategory;
