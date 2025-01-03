"use client"

import React, { useState } from "react";
import useClientEvents from "../services/useClientEvents";

interface SelectedEvent {
  id: number | null;
  name: string | null;
}

interface EventSelectProps {
  onChange: (selectedEvent: SelectedEvent) => void;
}

const EventSelect: React.FC<EventSelectProps> = ({ onChange }) => {
  const { events, isLoading, error } = useClientEvents();
  const [selectedEvent, setSelectedEvent] = useState<SelectedEvent>({
    id: null,
    name: null,
  });

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(event.target.value);
    const selectedName = event.target.options[event.target.selectedIndex].text;
    setSelectedEvent({ id: selectedId, name: selectedName });
    onChange({ id: selectedId, name: selectedName });
  };

  if (isLoading) return <p>Loading events...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <select
      className="inputDefault p-[7px] rounded-md"
      value={selectedEvent.id || ""}
      onChange={handleSelectChange}
    >
      <option value="" disabled>
        Select an Event
      </option>
      {events.map((event) => (
        <option key={event.Id} value={event.Id}>
          {event.EventName}
        </option>
      ))}
    </select>
  );
};

export default EventSelect;
