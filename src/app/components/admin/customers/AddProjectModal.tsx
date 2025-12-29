"use client";

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { Field, Formik, Form, ErrorMessage } from "formik";
import React from "react";
import useClientStore, { AddProjectType } from "@/store/useClientStore";
import Label from "../../common/Label";

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: number;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({ isOpen, onClose, clientId }) => {
  const { addProject, loading } = useClientStore();

  const initialValues: AddProjectType = {
    Name: "",
    ClientId: clientId,
    Description: "",
  };

  const handleSubmit = async (values: AddProjectType) => {
    await addProject(values, onClose);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">Add Project</ModalHeader>
            <Formik initialValues={initialValues} enableReinitialize onSubmit={handleSubmit}>
              {({ isSubmitting }) => (
                <Form>
                  <ModalBody>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex flex-col gap-1">
                        <Label label="Project Name" isRequired />
                        <Field
                          name="Name"
                          type="text"
                          maxLength={100}
                          required
                          className="rounded-xl dark:text-gray-400 text-gray-800 text-sm p-2 w-full outline-none dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100"
                        />
                        <ErrorMessage name="Name" component="div" className="text-red-500 text-sm" />
                      </div>

                      
                      <div className="flex flex-col gap-1">
                        <Label label="Description" isRequired={false} />
                        <Field
                          name="Description"
                          as="textarea"
                          rows={3}
                          maxLength={200}
                          className="rounded-xl dark:text-gray-400 text-gray-800 text-sm p-2 w-full outline-none dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100"
                        />
                      </div>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button variant="light" onPress={onClose}>
                      Cancel
                    </Button>
                    <Button color="primary" type="submit" isLoading={isSubmitting || loading}>
                      Save
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

export default AddProjectModal;


