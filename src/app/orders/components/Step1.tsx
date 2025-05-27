import React, { useEffect } from "react";
import { ErrorMessage, Field } from "formik";
import useClientStore from "@/store/useClientStore";
import useEventsStore from "@/store/useEventsStore";
import { PRIORITY_ENUM } from "@/interface/GetFileType";
import Label from "../../components/common/Label";

const Step1 = ({ formik }: { formik: any }) => {
  const { fetchClients, clients } = useClientStore();
  const { fetchEvents, Events } = useEventsStore();

  useEffect(() => {
    fetchClients();
    fetchEvents();
  }, []);

  const filteredEvents = [...Events].sort((a, b) => {
    if (!formik.values.ClientId) return 0;

    const selectedClientId = Number(formik.values.ClientId);

    if (a.ClientId === selectedClientId && b.ClientId !== selectedClientId)
      return -1;
    if (a.ClientId !== selectedClientId && b.ClientId === selectedClientId)
      return 1;

    return 0;
  });

  return (
    <div className="space-y-6 w-[500px]">
      <div className="flex flex-col gap-1">
        <Label isRequired={true} label="Client" />
        <Field
          as="select"
          name="ClientId"
          className="rounded-xl text-gray-400 text-sm p-2 w-full outline-none bg-gray-950 border-1 border-gray-600"
        >
          <option value={""}>Select a client</option>
          {clients?.map((client, index) => {
            return (
              <option value={client?.Id} key={index}>
                {client?.Name}
              </option>
            );
          })}
        </Field>
        <ErrorMessage
          name="ClientId"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label isRequired={true} label="Event" />
        <Field
          as="select"
          name="OrderEventId"
          className="rounded-xl text-gray-400 text-sm p-2 w-full outline-none bg-gray-950 border-1 border-gray-600"
        >
          <option value="">Select an event</option>
          {filteredEvents.map((event, index) => (
            <option value={event?.Id} key={index}>
              {event?.EventName} _ ({event.ClientName})
            </option>
          ))}
        </Field>
        <ErrorMessage
          name="OrderEventId"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label isRequired={true} label="Deadline" />
        <Field
          type="date"
          name="Deadline"
          className="rounded-xl text-gray-400 text-sm p-2 w-full outline-none bg-gray-950 border-1 border-gray-600"
        />
        <ErrorMessage
          name="Deadline"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label isRequired={false} label="Order Priority" />
        <Field
          as="select"
          name="OrderPriority"
          className="rounded-xl text-gray-400 text-sm p-2 w-full outline-none bg-gray-950 border-1 border-gray-600"
        >
          <option value="">Select a priority</option>
          {PRIORITY_ENUM.map((priority, index) => (
            <option value={priority.id} key={index}>
              {priority.label}
            </option>
          ))}
        </Field>
      </div>
    </div>
  );
};

export default Step1;
