import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { fetchEvents, deleteEvent } from "../redux/eventSlice";
import EditEventForm from "./EditEvent";
import { Event as CustomEvent } from "../redux/eventSlice";
import axios from "axios";
import AddParticipant from "./participant";

interface User {
  _id: string;
  name: string;
}

const EventList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { events, status } = useSelector((state: RootState) => state.events);

  const [users, setUsers] = useState<User[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CustomEvent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/users/participant");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching participants", error);
      }
    };

    fetchParticipants();
  }, []);

  useEffect(() => {
    if (status === "idle") dispatch(fetchEvents());
  }, [dispatch, status]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      dispatch(deleteEvent(id));
    }
  };

  const handleEventClick = async (id: string | undefined) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/events/${id}`);
      setSelectedEvent(response.data);
      setShowPopup(true);
    } catch (error) {
      console.error("Error fetching event details", error);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedEvent(null);
  };

  const handleParticipantAdded = async () => {
    if (selectedEvent?._id) {
      try {
        const response = await axios.get(`http://localhost:3000/api/events/${selectedEvent._id}`);
        setSelectedEvent(response.data);
      } catch (error) {
        console.error("Error reloading event details", error);
      }
    }
  };

  const getParticipantName = (id: string) => {
    const participant = users.find((user) => user._id === id);
    return participant ? participant.name : "Unknown Participant";
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Event List</h2>

      {status === "loading" ? (
        <div className="text-center">Loading...</div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <li
              key={event._id}
              className="p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition-all cursor-pointer"
              onClick={() => handleEventClick(event._id)}
            >
              <h3 className="text-xl font-semibold">{event.name}</h3>
              <p className="text-gray-600">Date: {new Date(event.date).toLocaleDateString()}</p>
              <p className="text-gray-600">Location: {event.location}</p>
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(event._id!);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isEditing && selectedEvent && (
        <EditEventForm event={selectedEvent} onClose={() => setIsEditing(false)} />
      )}

      {showPopup && selectedEvent && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-4/5 md:w-1/2 lg:w-1/3 relative">
            <button
              onClick={closePopup}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-all"
            >
              ✕
            </button>
            <h2 className="text-2xl font-semibold mb-4">Event Details</h2>
            <p>
              <strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Location:</strong> {selectedEvent.location}
            </p>
            <p>
              <strong>Description:</strong> {selectedEvent.description}
            </p>
            <h3 className="text-xl font-semibold mt-4">Participants:</h3>
            <ul className="list-disc pl-5">
              {selectedEvent.participants?.map((participantId: string) => (
                <li key={participantId} className="text-gray-700">
                  {getParticipantName(participantId)}
                </li>
              ))}
            </ul>
            <AddParticipant eventId={selectedEvent._id || ""} onParticipantAdded={handleParticipantAdded} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EventList;