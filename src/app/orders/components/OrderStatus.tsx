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
import React, { useEffect, useState } from "react";
import Label from "../../components/common/Label";
import { ChangeStatusSchema } from "../../schema/CutOptionSchema";
import useOrderStatusStore from "@/store/useOrderStatusStore";

interface ComponentProps {
  isOpen: boolean;
  OrderId: number;
  onCloseStatusModal: () => void;
  onChangeStatus?: (statusId: number, statusName: string) => void;
}

const OrderStatus: React.FC<ComponentProps> = ({
  isOpen,
  OrderId,
  onCloseStatusModal,
  onChangeStatus,
}) => {
  
  const { fetchStatuses, statuses, loading } = useOrderStatusStore();

  const InitialValues = {};

  const handleSumit = (values: any) => {
    const selectedStatus = statuses.find(
      (status) => status.Id.toString() === values.StatusId
    );

    if (selectedStatus) {
      onChangeStatus?.(selectedStatus.Id, selectedStatus.StatusName);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, [OrderId]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onCloseStatusModal}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader>Update Order Status</ModalHeader>
            <Formik
              validationSchema={ChangeStatusSchema}
              initialValues={InitialValues}
              enableReinitialize
              onSubmit={handleSumit}
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
                              label="Status"
                              labelForm="Status"
                            />
                            <Field
                              name="StatusId"
                              as="select"
                              className="formInputdefault bg-gray-100"
                            >
                              <option value={""}>Select a status</option>
                              {statuses?.map((status, index) => {
                                return (
                                  <option value={status?.Id} key={index}>
                                    {status?.StatusName}
                                  </option>
                                );
                              })}
                            </Field>
                            <ErrorMessage
                              name="StatusId"
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
                      onPress={onCloseStatusModal}
                    >
                      Cancel
                    </Button>
                    <Button
                      isLoading={isSubmitting}
                      color="primary"
                      type="submit"
                    >
                      Update
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

export default OrderStatus;
