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
import useFabricStore from "@/store/useFabricStore";
import useProductStore from "@/store/useProductStore";
import { ProductSchema } from "../../schema/ProductSchema";

interface AddClientComponentProps {
  isOpen: boolean;
  isEdit: boolean;
  productId: number;
  closeAddModal: () => void;
}

const AddProduct: React.FC<AddClientComponentProps> = ({
  isOpen,
  closeAddModal,
  isEdit,
  productId,
}) => {
  interface AddProduct {
    ProductCategoryId: number;
    FabricTypeId: number;
    Name: string;
    Description: string;
    CreatedBy: string;
    UpdatedBy: string;
  }

  const {addProduct, getProductById, productType, updateProduct, loading} = useProductStore();
  const {fetchCategories, productCategories} = useCategoryStore();
  const {fetchFabricType, fabricTypeData} = useFabricStore();

  useEffect(() => {
    if (productId && isEdit) {
      getProductById(productId);
    }
  }, [productId, isEdit]);

  useEffect(()=>{
    fetchCategories();
    fetchFabricType();
  },[])

  const InitialValues:AddProduct = {
    Name: isEdit && productType ? productType.Name : "",
    ProductCategoryId: isEdit && productType ? Number(productType.ProductCategoryId) : 0,
    FabricTypeId: isEdit && productType ? Number(productType.FabricTypeId) : 0,
    Description: isEdit && productType ? productType.Description : "",
    CreatedBy: isEdit && productType ? productType.CreatedBy : "Admin",
    UpdatedBy:isEdit && productType ? productType.UpdatedBy : "Admin",
  };

  const handleAddFabric = async (values: AddProduct) => {
    isEdit
      ? updateProduct(productId, values, () => {
          closeAddModal();
        })
      : addProduct(values, () => {
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
                <> Add Product</>
              ) : (
                <> Edit Product</>
              )}
            </ModalHeader>
            <Formik
              validationSchema={ProductSchema}
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
                              placeholder="Enter Name"
                              className="formInputdefault"
                            />
                            <ErrorMessage
                              name="Name"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-600 font-sans">
                            Product Category
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              name="ProductCategoryId"
                              as="select"
                              className="formInputdefault"
                            >
                              <option value={""}>Select a type</option>
                              {
                                productCategories.map((category)=>{
                                  return(
                                    <option value={category.id}>{category.type}</option>
                                  )
                                })
                              }
                            </Field>
                            <ErrorMessage
                              name="ProductCategoryId"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-600 font-sans">
                            Fabric Type
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              name="FabricTypeId"
                              as="select"
                              className="formInputdefault"
                            >
                              <option value={""}>Select a type</option>
                              {
                                fabricTypeData.map((category)=>{
                                  return(
                                    <option value={category.id}>
                                      {`${category.name}_${category.type}_${category.gsm}`}
                                    </option>
                                  )
                                })
                              }
                            </Field>
                            <ErrorMessage
                              name="FabricTypeId"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-600 font-sans">
                            Description
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              name="Description"
                              as="textarea"
                              placeholder="Description"
                              rows={4}
                              className="formInputdefault !h-auto"
                            />
                            <ErrorMessage
                              name="Description"
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
                      {isEdit ? "Edit" : "Add"} Product
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

export default AddProduct;
