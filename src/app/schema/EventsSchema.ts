import * as Yup from "yup";

export const EventsSchema = Yup.object().shape({
  EventName: Yup.string().trim().required("Event name is required").max(180),
  ClientId: Yup.string().optional(),
  Description: Yup.string().optional(),
});