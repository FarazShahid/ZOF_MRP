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
import useInventoryItemsStore from "@/store/useInventoryItemsStore";
import { InventoryTransactionSchema } from "../schema/InventoryItemSchema";
import useInventoryTransection, {
  AddInventoryTransactionType,
  TRANSACTION_TYPES,
} from "@/store/useInventoryTransection";

interface AddComponentProps {
  isOpen: boolean;
  isEdit: boolean;
  Id: number;
  closeAddModal: () => void;
}

const AddInventoryTransaction: React.FC<AddComponentProps> = ({
  isOpen,
  closeAddModal,
  isEdit,
  Id,
}) => {
  const {
    loading,
    getInventoryTransactionById,
    inventoryTransactionById,
    addInventoryTransaction,
    updateInventoryTransaction,
  } = useInventoryTransection();

  const { fetchInventoryItems, inventoryItems } = useInventoryItemsStore();

  useEffect(() => {
    if (Id && isEdit) {
      getInventoryTransactionById(Id);
    }
  }, [Id, isEdit]);

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  const InitialValues = {
    InventoryItemId:
      isEdit && inventoryTransactionById
        ? inventoryTransactionById.InventoryItemId
        : 0,
    Quantity:
      isEdit && inventoryTransactionById
        ? Number(inventoryTransactionById.Quantity)
        : 0,
    TransactionType:
      isEdit && inventoryTransactionById
        ? inventoryTransactionById.TransactionType
        : "",
  };

  const handleAdd = async (values: AddInventoryTransactionType) => {
    isEdit
      ? updateInventoryTransaction(Id, values, () => {
          closeAddModal();
        })
      : addInventoryTransaction(values, () => {
          closeAddModal();
        });
  };

  return (
    <Modal isOpen={isOpen} size="lg" onOpenChange={closeAddModal}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {!isEdit ? <> Add</> : <> Edit</>} Inventory Transection
            </ModalHeader>
            <Formik
              validationSchema={InventoryTransactionSchema}
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
                              Inventory Item
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              name="InventoryItemId"
                              as="select"
                              className="formInputdefault bg-gray-100"
                            >
                              <option value={0}>Select inventory item</option>
                              {inventoryItems?.map((inventoryItem, index) => {
                                return (
                                  <option value={inventoryItem?.Id} key={index}>
                                    {inventoryItem?.Name}
                                  </option>
                                );
                              })}
                            </Field>
                            <ErrorMessage
                              name="InventoryItemId"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-600 font-sans">
                              Quantity
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              name="Quantity"
                              type="number"
                              className="formInputdefault bg-gray-100"
                            />
                            <ErrorMessage
                              name="Quantity"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-600 font-sans">
                              Transaction Type
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              name="TransactionType"
                              as="select"
                              className="formInputdefault bg-gray-100"
                            >
                              <option value={0}>Select Transaction Type</option>
                              {TRANSACTION_TYPES?.map((type, index) => {
                                return (
                                  <option value={type?.value} key={index}>
                                    {type?.label}
                                  </option>
                                );
                              })}
                            </Field>
                            <ErrorMessage
                              name="TransactionType"
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

export default AddInventoryTransaction;
