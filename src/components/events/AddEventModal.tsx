"use client";

import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import useEventsStore, { AddEvent } from "@/store/useEventsStore";
import useClientStore from "@/store/useClientStore";
import { EventsSchema } from "@/src/app/schema/EventsSchema";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  isEdit?: boolean;
  eventId?: number;
}

const inputClassName =
  "w-full bg-slate-800 text-slate-300 text-sm px-4 py-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500";
const errorClassName = "text-red-400 text-xs mt-1";
const labelClassName = "block text-sm font-medium text-slate-300 mb-2";

const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  isEdit = false,
  eventId = 0,
}) => {
  const { eventById, getEventsById, addEvent, updateEvent, loading } =
    useEventsStore();
  const { clients, fetchClients } = useClientStore();

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    if (eventId && isEdit) {
      getEventsById(eventId);
    }
  }, [eventId, isEdit, getEventsById]);

  const formInitialValues = {
    EventName: (isEdit && eventById ? eventById.EventName : "") || "",
    ClientId: (isEdit && eventById ? String(eventById.ClientId) : "") || "",
    Description: (isEdit && eventById ? eventById.Description : "") || "",
  };

  const handleSubmit = async (values: typeof formInitialValues) => {
    const payload: AddEvent = {
      EventName: values.EventName.trim(),
      ClientId: values.ClientId ? Number(values.ClientId) : undefined,
      Description: values.Description?.trim() || "",
    };

    if (isEdit && eventId) {
      await updateEvent(eventId, payload, () => {
        onClose();
        onSuccess?.();
      });
    } else {
      await addEvent(payload, () => {
        onClose();
        onSuccess?.();
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-slate-900 rounded-2xl p-6 max-w-2xl w-full mx-4 my-8 border border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">
            {isEdit ? "Edit Event" : "Add New Event"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <i className="ri-close-line text-xl w-5 h-5 flex items-center justify-center"></i>
          </button>
        </div>

        {loading && !eventById && isEdit ? (
          <div className="py-12 flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <Formik
            initialValues={formInitialValues}
            validationSchema={EventsSchema}
            enableReinitialize
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label className={labelClassName}>
                    Event Name <span className="text-red-400">*</span>
                  </label>
                  <Field
                    name="EventName"
                    type="text"
                    maxLength={180}
                    placeholder="Enter event name"
                    className={inputClassName}
                  />
                  <ErrorMessage name="EventName" component="div" className={errorClassName} />
                </div>

                <div>
                  <label className={labelClassName}>Client</label>
                  <Field
                    name="ClientId"
                    as="select"
                    className={`${inputClassName} cursor-pointer`}
                  >
                    <option value="">Select a client</option>
                    {clients?.map((client) => (
                      <option key={client.Id} value={String(client.Id)}>
                        {client.Name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="ClientId" component="div" className={errorClassName} />
                </div>

                <div>
                  <label className={labelClassName}>Description</label>
                  <Field
                    name="Description"
                    as="textarea"
                    rows={4}
                    placeholder="Describe the event or program..."
                    className={`${inputClassName} resize-none`}
                  />
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium text-sm transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Saving..." : isEdit ? "Update" : "Create Event"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default AddEventModal;
