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
import { EventsSchema } from "../schema/EventsSchema";
import useClientStore from "@/store/useClientStore";
import Label from "../components/common/Label";

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
  const {fetchClients, clients} = useClientStore();


  useEffect(()=>{
    fetchClients();
  },[])

  useEffect(() => {
    if (eventId && isEdit) {
      getEventsById(eventId);
    }
  }, [eventId, isEdit]);

  const InitialValues = {
    EventName: isEdit && eventById ? eventById?.EventName : "",
    ClientId: isEdit && eventById ? eventById?.ClientId : 0,
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
              {!isEdit ? <> Add</> : <> Edit</>} Eveent
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
                             <Label isRequired={true} label="Name" labelForm="Name" />
                            <Field
                              name="EventName"
                              type="text"
                              maxLength="180"
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
                            <Label isRequired={false} label="Client" labelForm="Client" />
                            <Field
                              name="ClientId"
                              as="select"
                              className="formInputdefault border-1"
                            >
                              <option value={""}>Select a client</option>
                              {
                                clients?.map((client, index)=>{
                                  return(
                                    <option value={client?.Id} key={index}>{client?.Name}</option>
                                  )
                                })
                              }
                            </Field>
                            <ErrorMessage
                              name="ClientId"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>

                          <div className="flex flex-col gap-1 w-full">
                            <Label isRequired={false} label="Description" labelForm="Description" />
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

export default EventsForm;
