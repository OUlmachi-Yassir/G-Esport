import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Event {
  _id?: string;
  name: string;
  date: string;
  location: string;
  description?: string;
  participants?: string[];
}

interface EventState {
  events: Event[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: EventState = {
  events: [],
  status: 'idle',
  error: null,
};

// Async actions
export const fetchEvents = createAsyncThunk('events/fetchEvents', async () => {
  const response = await axios.get('http://localhost:3000/api/events');
  return response.data;
});

export const createEvent = createAsyncThunk('events/createEvent', async (newEvent: Event) => {
  const response = await axios.post('http://localhost:3000/api/events', newEvent);
  return response.data.event;
});

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async ({ id, updatedEvent }: { id: string; updatedEvent: Event }) => {
    const response = await axios.put(`http://localhost:3000/api/events/${id}`, updatedEvent);
    return response.data.updatedEvent;
  }
);

export const deleteEvent = createAsyncThunk('events/deleteEvent', async (id: string) => {
  await axios.delete(`http://localhost:3000/api/events/${id}`);
  return id;
});

// Slice
const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch events';
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.events.push(action.payload);
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex((event) => event._id === action.payload._id);
        if (index !== -1) state.events[index] = action.payload;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter((event) => event._id !== action.payload);
      });
  },
});

export default eventSlice.reducer;
