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
import { CatagorySchema } from "../../schema/CatagorySchema";
import Label from "../../components/common/Label";

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
    Type: string;
  }

  const {
    productCategory,
    getCategoryById,
    addCategory,
    updateCategory,
    loading,
  } = useCategoryStore();

  useEffect(() => {
    if (productIdCatagory && isEdit) {
      getCategoryById(productIdCatagory);
    }
  }, [productIdCatagory, isEdit]);

  const InitialValues = {
    Type: isEdit && productCategory ? productCategory.Type : "",
    IsTopUnit: isEdit && productCategory ? productCategory.IsTopUnit : false,
    IsBottomUnit:
      isEdit && productCategory ? productCategory.IsBottomUnit : false,
    SupportsLogo:
      isEdit && productCategory ? productCategory.SupportsLogo : false,
    IsHat: isEdit && productCategory ? productCategory.IsHat : false,
    IsBag: isEdit && productCategory ? productCategory.IsBag : false,
    IsSocks: isEdit && productCategory ? productCategory.IsSocks : false,
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
                            <Label
                              isRequired={true}
                              label="Name"
                              labelForm="Name"
                            />
                            <Field
                              name="Type"
                              type="text"
                              maxLength={100}
                              placeholder="Enter Name"
                              className="formInputdefault bg-gray-100"
                            />
                            <ErrorMessage
                              name="Type"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="flex items-center gap-2">
                              <Field
                                name="IsTopUnit"
                                type="checkbox"
                                className="w-4 h-4"
                              />
                              <Label
                                isRequired={false}
                                label="Top Unit"
                                labelForm="IsTopUnit"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Field
                                name="IsBottomUnit"
                                type="checkbox"
                                className="w-4 h-4"
                              />
                              <Label
                                isRequired={false}
                                label="Bottom Unit"
                                labelForm="IsBottomUnit"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Field
                                name="SupportsLogo"
                                type="checkbox"
                                className="w-4 h-4"
                              />
                              <Label
                                isRequired={false}
                                label="Supports Logo"
                                labelForm="SupportsLogo"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Field
                                name="IsHat"
                                type="checkbox"
                                className="w-4 h-4"
                              />
                              <Label
                                isRequired={false}
                                label="Hat"
                                labelForm="IsHat"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Field
                                name="IsBag"
                                type="checkbox"
                                className="w-4 h-4"
                              />
                              <Label
                                isRequired={false}
                                label="Bag"
                                labelForm="IsBag"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Field
                                name="IsSocks"
                                type="checkbox"
                                className="w-4 h-4"
                              />
                              <Label
                                isRequired={false}
                                label="Socks"
                                labelForm="IsSocks"
                              />
                            </div>
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

export default AddProductCatagory;
