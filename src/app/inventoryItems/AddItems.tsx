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
import useInventoryItemsStore, {
  AddInventoryItemOptions,
} from "@/store/useInventoryItemsStore";
import { InventoryItemSchema } from "../schema/InventoryItemSchema";
import useInventorySubCategoryStore from "@/store/useInventorySubCategoryStore";
import useSupplierStore from "@/store/useSupplierStore";

interface AddComponentProps {
  isOpen: boolean;
  isEdit: boolean;
  Id: number;
  closeAddModal: () => void;
}

const AddItems: React.FC<AddComponentProps> = ({
  isOpen,
  closeAddModal,
  isEdit,
  Id,
}) => {
  const {
    loading,
    getInventoryItemById,
    inventoryItemById,
    updateInventoryItem,
    addInventoryItem,
  } = useInventoryItemsStore();

  const { fetchSubCategories, subCategories } = useInventorySubCategoryStore();
  const { fetchSuppliers, suppliers } = useSupplierStore();

  useEffect(() => {
    if (Id && isEdit) {
      getInventoryItemById(Id);
    }
  }, [Id, isEdit]);

  useEffect(() => {
    fetchSubCategories();
    fetchSuppliers();
  }, []);

  const InitialValues = {
    Name: isEdit && inventoryItemById ? inventoryItemById.Name : "",
    SubCategoryId:
      isEdit && inventoryItemById ? inventoryItemById.SubCategoryId : 0,
    UnitOfMeasure:
      isEdit && inventoryItemById ? inventoryItemById.UnitOfMeasure : "",
    SupplierId: isEdit && inventoryItemById ? inventoryItemById.SupplierId : 0,
    ReorderLevel:
      isEdit && inventoryItemById ? Number(inventoryItemById.ReorderLevel) : 0,
    Stock: isEdit && inventoryItemById ? inventoryItemById.Stock : 0,
  };

  const handleAdd = async (values: AddInventoryItemOptions) => {
    console.log("values", values);
    isEdit
      ? updateInventoryItem(Id, values, () => {
          closeAddModal();
        })
      : addInventoryItem(values, () => {
          closeAddModal();
        });
  };

  return (
    <Modal isOpen={isOpen} size="2xl" onOpenChange={closeAddModal}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {!isEdit ? <> Add Item</> : <> Edit Item</>}
            </ModalHeader>
            <Formik
              validationSchema={InventoryItemSchema}
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
                              Sub Category
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              name="SubCategoryId"
                              as="select"
                              className="formInputdefault"
                            >
                              <option value={0}>Select sub category</option>
                              {subCategories.map((category) => {
                                return (
                                  <option value={category.Id}>
                                    {category.Name}
                                  </option>
                                );
                              })}
                            </Field>
                            <ErrorMessage
                              name="SubCategoryId"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-600 font-sans">
                              Supplier
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              name="SupplierId"
                              as="select"
                              className="formInputdefault"
                            >
                              <option value={0}>Select Supplier</option>
                              {suppliers.map((supplier) => {
                                return (
                                  <option value={supplier.Id}>
                                    {supplier.Name}
                                  </option>
                                );
                              })}
                            </Field>
                            <ErrorMessage
                              name="SupplierId"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-600 font-sans">
                              Unit Of Measure
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              name="UnitOfMeasure"
                              type="number"
                              className="formInputdefault"
                            />
                            <ErrorMessage
                              name="UnitOfMeasure"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-600 font-sans">
                              Reorder Level
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              name="ReorderLevel"
                              type="number"
                              className="formInputdefault"
                            />
                            <ErrorMessage
                              name="ReorderLevel"
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

export default AddItems;
