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
import useClientStore from "@/store/useClientStore";
import useOrderStore from "@/store/useOrderStore";
import useSupplierStore from "@/store/useSupplierStore";
import Label from "../components/common/Label";

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
  const { fetchClients, clients } = useClientStore();
  const { fetchOrders, Orders } = useOrderStore();
  const { fetchSuppliers, suppliers } = useSupplierStore();

  useEffect(() => {
    if (Id && isEdit) {
      getInventoryTransactionById(Id);
    }
  }, [Id, isEdit]);

  useEffect(() => {
    fetchInventoryItems();
    fetchSuppliers();
    fetchClients();
  }, []);

  const InitialValues = {
    ClientId:
      isEdit && inventoryTransactionById
        ? inventoryTransactionById?.ClientId
        : 0,
    OrderId:
      isEdit && inventoryTransactionById
        ? inventoryTransactionById?.OrderId
        : 0,
    SupplierId: isEdit && inventoryTransactionById
        ? inventoryTransactionById?.SupplierId
        : 0,
    InventoryItemId:
      isEdit && inventoryTransactionById
        ? inventoryTransactionById?.InventoryItemId
        : 0,
    Quantity:
      isEdit && inventoryTransactionById
        ? Number(inventoryTransactionById?.Quantity)
        : 0,
    TransactionType:
      isEdit && inventoryTransactionById
        ? inventoryTransactionById?.TransactionType
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
    <Modal isOpen={isOpen} size="2xl" onOpenChange={closeAddModal}>
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
              {({ isSubmitting, setFieldValue }) => (
                <Form>
                  <ModalBody>
                    {loading ? (
                      <Spinner />
                    ) : (
                      <>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1 w-full">
                            <Label isRequired={false} label="Client" />
                            <Field
                              name="ClientId"
                              as="select"
                              className="formInputdefault border-1"
                              onChange={(
                                e: React.ChangeEvent<HTMLSelectElement>
                              ) => {
                                const value = Number(e.target.value);
                                setFieldValue("ClientId", value);
                                fetchOrders(value);
                              }}
                            >
                              <option value={0}>Select client</option>
                              {clients?.map((client, index) => {
                                return (
                                  <option value={client?.Id} key={index}>
                                    {client?.Name}
                                  </option>
                                );
                              })}
                            </Field>
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <Label isRequired={false} label="Order" />
                            <Field
                              name="OrderId"
                              as="select"
                              className="formInputdefault border-1"
                            >
                              <option value={0}>Select order</option>
                              {Orders?.map((Order, index) => {
                                return (
                                  <option value={Order?.Id} key={index}>
                                    {Order?.OrderName}
                                  </option>
                                );
                              })}
                            </Field>
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <Label isRequired={false} label="Supplier" />
                            <Field
                              name="SupplierId"
                              as="select"
                              className="formInputdefault border-1"
                            >
                              <option value={0}>Select supplier</option>
                              {suppliers?.map((supplier, index) => {
                                return (
                                  <option value={supplier?.Id} key={index}>
                                    {supplier?.Name}
                                  </option>
                                );
                              })}
                            </Field>
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <Label isRequired={true} label="Inventory Item" />
                            <Field
                              name="InventoryItemId"
                              as="select"
                              className="formInputdefault border-1"
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
                            <Label isRequired={true} label="Quantity" />
                            <Field
                              name="Quantity"
                              type="number"
                              className="formInputdefault border-1"
                            />
                            <ErrorMessage
                              name="Quantity"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <Label isRequired={true} label="Transaction Type" />
                            <Field
                              name="TransactionType"
                              as="select"
                              className="formInputdefault border-1"
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
