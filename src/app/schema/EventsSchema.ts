import * as Yup from 'yup';

export const EventsSchema = Yup.object().shape({
    EventName: Yup.string().required('Name is required'),
    ClientId: Yup.string().required('Client is required'),
})