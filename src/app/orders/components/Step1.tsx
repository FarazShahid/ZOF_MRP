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

  const selectedClientId = Number(formik.values.ClientId);

  const filteredEvents = [...Events].sort((a, b) => {
    if (!selectedClientId) return 0;
    return (
      (b.ClientId === selectedClientId ? 1 : 0) -
      (a.ClientId === selectedClientId ? 1 : 0)
    );
  });

  const fieldStyle =
    "rounded-xl dark:text-gray-400 text-gray-800 text-sm p-2 w-full outline-none dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100";

  return (
    <div className="space-y-6 w-[500px]">
      <div className="flex flex-col gap-1">
        <Label isRequired={true} label="Client" />
        <Field as="select" name="ClientId" className={fieldStyle}>
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
        <Field as="select" name="OrderEventId" className={fieldStyle}>
          <option value="">Select an event</option>
          {filteredEvents?.map((event, index) => (
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
        <Field type="date" name="Deadline" className={fieldStyle} />
        <ErrorMessage
          name="Deadline"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label isRequired={false} label="Order Priority" />
        <Field as="select" name="OrderPriority" className={fieldStyle}>
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
