import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { createEvent, updateEvent } from '../redux/eventSlice';

interface EventFormProps {
  event?: any;
  onSubmitSuccess: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ event, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    name: event?.name || '',
    date: event?.date || '',
    location: event?.location || '',
    description: event?.description || '',
  });

  const dispatch = useDispatch<AppDispatch>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (event) {
      dispatch(updateEvent({ id: event._id, updatedEvent: formData })).then(onSubmitSuccess);
    } else {
      dispatch(createEvent(formData)).then(onSubmitSuccess);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        name="date"
        type="date"
        value={formData.date}
        onChange={handleChange}
        required
      />
      <input
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
      ></textarea>
      <button type="submit">{event ? 'Update' : 'Create'}</button>
    </form>
  );
};

export default EventForm;
