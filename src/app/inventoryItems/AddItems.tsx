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
import useInventorySubCategoryStore from "@/store/useInventorySubCategoryStore";
import useSupplierStore from "@/store/useSupplierStore";
import useUnitOfMeasureStore from "@/store/useUnitOfMeasureStore";
import { InventoryItemSchema } from "../schema/InventoryItemSchema";
import Label from "../components/common/Label";

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
  const {fetchUnitOfMeasures, unitMeasures} = useUnitOfMeasureStore();

  useEffect(() => {
    if (Id && isEdit) {
      getInventoryItemById(Id);
    }
  }, [Id, isEdit]);

  useEffect(() => {
    fetchSubCategories();
    fetchSuppliers();
    fetchUnitOfMeasures();
  }, []);

  const InitialValues = {
    Name: isEdit && inventoryItemById ? inventoryItemById.Name : "",
    SubCategoryId:
      isEdit && inventoryItemById ? inventoryItemById.SubCategoryId : 0,
    UnitOfMeasureId:
      isEdit && inventoryItemById ? inventoryItemById.UnitOfMeasureId : "",
    SupplierId: isEdit && inventoryItemById ? inventoryItemById.SupplierId : 0,
    ReorderLevel:
      isEdit && inventoryItemById ? Number(inventoryItemById.ReorderLevel) : 0,
    Stock: isEdit && inventoryItemById ? inventoryItemById.Stock : 0,
  };

  const handleAdd = async (values: AddInventoryItemOptions) => {
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
                            <Label isRequired={true} 
                              label="Name" 
                              labelForm="Name" />
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
                            <Label isRequired={true}
                               label="Sub Category" 
                               labelForm="Sub Category" />
                            <Field
                              name="SubCategoryId"
                              as="select"
                              className="formInputdefault border-1"
                            >
                              <option value={0}>Select sub category</option>
                              {subCategories?.map((category, index) => {
                                return (
                                  <option value={category?.Id} key={index}>
                                    {category?.Name}
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
                            <Label isRequired={true}
                               label="Supplier" 
                               labelForm="Supplier" />
                            <Field
                              name="SupplierId"
                              as="select"
                              className="formInputdefault border-1"
                            >
                              <option value={0}>Select Supplier</option>
                              {suppliers?.map((supplier, index) => {
                                return (
                                  <option value={supplier?.Id} key={index}>
                                    {supplier?.Name}
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
                             <Label isRequired={true}
                               label="Unit Of Measure" 
                               labelForm="Unit Of Measure" />
                            <Field
                              name="UnitOfMeasureId"
                              as="select"
                               className="formInputdefault border-1"
                            >
                              <option value={0}>Select Unit of measure</option>
                              {unitMeasures?.map((unitMeasure, index) => {
                                return (
                                  <option value={unitMeasure?.Id} key={index}>
                                    {unitMeasure?.Name}
                                  </option>
                                );
                              })}
                            </Field>
                            <ErrorMessage
                              name="UnitOfMeasure"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <Label isRequired={true}
                               label="Reorder Level" 
                               labelForm="Reorder Level" />
                            <Field
                              name="ReorderLevel"
                              type="number"
                               className="formInputdefault border-1"
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
