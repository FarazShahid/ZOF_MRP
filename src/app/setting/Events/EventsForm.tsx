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
import useEventsStore, { AddEvent } from "@/store/useEventsStore";
import { EventsSchema } from "../../schema/EventsSchema";

interface AddClientComponentProps {
  isOpen: boolean;
  isEdit: boolean;
  eventId: number;
  closeAddModal: () => void;
}

const EventsForm: React.FC<AddClientComponentProps> = ({
  isOpen,
  closeAddModal,
  isEdit,
  eventId,
}) => {
  const { loading, eventById, getEventsById, addEvent, updateEvent } =
    useEventsStore();

  useEffect(() => {
    if (eventId && isEdit) {
      getEventsById(eventId);
    }
  }, [eventId, isEdit]);

  const InitialValues = {
    EventName: isEdit && eventById ? eventById?.EventName : "",
    Description: isEdit && eventById ? eventById?.Description : "",
  };

  const handleAddFabric = async (values: AddEvent) => {
    isEdit
      ? updateEvent(eventId, values, () => {
          closeAddModal();
        })
      : addEvent(values, () => {
          closeAddModal();
        });
  };

  return (
    <Modal isOpen={isOpen} size="lg" onOpenChange={closeAddModal}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {!isEdit ? <> Add Event</> : <> Edit Event</>}
            </ModalHeader>
            <Formik
              validationSchema={EventsSchema}
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
                              name="EventName"
                              type="text"
                              placeholder="Enter Type"
                              className="formInputdefault border-1"
                            />
                            <ErrorMessage
                              name="EventName"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>

                          <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-600 font-sans">
                              Description
                            </label>
                            <Field
                              as="textarea"
                              name="Description"
                              className="formInputdefault !h-auto border-1"
                              rows={4}
                              placeholder="Enter Description"
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
                      {isEdit ? "Edit" : "Add"}
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

export default EventsForm;
