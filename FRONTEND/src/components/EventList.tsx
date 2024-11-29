import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { fetchEvents, deleteEvent } from "../redux/eventSlice";
import EditEventForm from "./EditEvent";
import { Event as CustomEvent } from "../redux/eventSlice";
import axios from "axios";
import AddParticipant from "./participant";
import { useReactToPrint } from "react-to-print"; 

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
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [confirmation, setConfirmation] = useState<{ message: string; onConfirm: () => void } | null>(null);


  const contentRef = useRef<HTMLDivElement | null>(null);

    const reactToPrintFn = useReactToPrint({contentRef});
    
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/users/participant");
        setUsers(response.data);
      } catch (error) {
        setMessage({ text: "Error fetching participants", type: "error" });
        console.error("Error fetching participants", error);
      }
    };

    fetchParticipants();
  }, []);

  useEffect(() => {
    if (status === "idle") dispatch(fetchEvents());
  }, [dispatch, status]);

  const handleDelete = (id: string) => {
    setConfirmation({
      message: "Are you sure you want to delete this event?",
      onConfirm: async () => {
        try {
          await dispatch(deleteEvent(id));
          setMessage({ text: "Event deleted successfully", type: "success" });
        } catch (error) {
          setMessage({ text: "Failed to delete event", type: "error" });
        }
      },
    });
  };

  const handleEventClick = async (id: string | undefined) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/events/${id}`);
      setSelectedEvent(response.data);
      setShowPopup(true);
    } catch (error) {
      setMessage({ text: "Error fetching event details", type: "error" });
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
        setMessage({ text: "Participant added successfully", type: "success" });
      } catch (error) {
        setMessage({ text: "Failed to reload event details", type: "error" });
        console.error("Error reloading event details", error);
      }
    }
  };


  const handleRemoveParticipant = async (eventId: string, participantId: string) => {
    setConfirmation({
      message: "Are you sure you want to remove this participant?",
      onConfirm: async () => {
        try {
          const response = await axios.post("http://localhost:3000/api/events/removeParticipant", {
            eventId,
            participantId,
          });
          if (response.status === 200) {
            setMessage({ text: "Participant removed successfully", type: "success" });
            const updatedEvent = await axios.get(`http://localhost:3000/api/events/${eventId}`);
            setSelectedEvent(updatedEvent.data);
          }
        } catch (error) {
          setMessage({ text: "Failed to remove participant", type: "error" });
        }
      },
    });
  };
  

  const getParticipantName = (id: string) => {
    const participant = users.find((user) => user._id === id);
    return participant ? participant.name : "Unknown Participant";
  };

  return (
    <div className="container mx-auto p-6">
       {message && (
        <div
          className={`mb-4 p-4 rounded-lg text-center ${
            message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Event List</h2>

      {confirmation && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="mb-4">{confirmation.message}</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  confirmation.onConfirm();
                  setConfirmation(null);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-800"
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmation(null)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-800"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
  
      {status === "loading" ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-200 shadow-lg rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left text-gray-700 font-semibold">Event Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-gray-700 font-semibold">Date</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-gray-700 font-semibold">Location</th>
                <th className="border border-gray-300 px-4 py-2 text-center text-gray-700 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr
                  key={event._id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 transition-all`}
                >
                  <td className="border border-gray-300 px-4 py-2">{event.name}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(event.date).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{event.location}</td>
                  <td className="border border-gray-300 px-4 py-2 flex justify-center space-x-2">
                    <button
                      onClick={() => handleEventClick(event._id)}
                      className=" px-1  text-white rounded-full hover:bg-gray-200 transition-all"
                    >
                    <svg viewBox="0 0 576 512" 
                      height="1.5em" 
                      xmlns="http://www.w3.org/2000/svg">
                        <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z">
                        </path>
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditing(true);
                        setSelectedEvent(event);
                      }}
                      className="px-3 py-1 bg-white text-white rounded-full hover:shadow-2xl hover:bg-yellow-300 transition-all "
                    >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 21H21" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 17V13L17 3L21 7L11 17H7Z" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 6L18 10" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>

                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(event._id!);
                      }}
                      className="px-3 py-1 bg-black text-white rounded-full hover:bg-red-600 transition-all"
                    >
                      <svg
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="h-5 w-5 "
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            strokeWidth="2"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                          ></path>
                        </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
            <div  ref={contentRef}>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Event Details</h2>
            <p>
              <strong>Name</strong> {(selectedEvent.name)}
            </p>
            <p>
              <strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Location:</strong> {selectedEvent.location}
            </p>
            <p>
              <strong>Description:</strong> {selectedEvent.description}
            </p>
            <div className="flex justify-between items-center">
                  <h3 className="text-left px-4 py-2 text-gray-700 font-semibold">Participants:</h3>
                <button
                    onClick={() => reactToPrintFn()}
                    className="mt-4 px-5 py-3 bg-green-200 text-white shadow-2xl rounded-full hover:bg-green-600 transition-all">
                    <svg className="svgIcon" viewBox="0 0 384 512" height="1em" xmlns="http://www.w3.org/2000/svg"><path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path></svg>
                      <span className="icon2"></span>
                  </button>
            </div>
            <br />
            <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-4 py-2 text-gray-700 font-semibold">Participant Name</th>
                  <th className="px-4 py-2 text-gray-700 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedEvent.participants?.map((participantId: string, index) => (
                  <tr
                    key={participantId}
                    className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-200`}
                  >
                    <td className="px-4 py-2 text-gray-700">{getParticipantName(participantId)}</td>
                    <td className="px-4 py-2 flex justify-center">
                      <button
                        onClick={() => handleRemoveParticipant(selectedEvent._id || "", participantId)}
                        className="px-3 py-1 text-white bg-red-500 rounded-full hover:bg-red-600 transition-all"
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M15.8334 3.33333H12.9167L12.0834 2.5H7.91675L7.08342 3.33333H4.16675V5H15.8334M5.00008 15.8333C5.00008 16.2754 5.17568 16.6993 5.48824 17.0118C5.8008 17.3244 6.22472 17.5 6.66675 17.5H13.3334C13.7754 17.5 14.1994 17.3244 14.5119 17.0118C14.8245 16.6993 15.0001 16.2754 15.0001 15.8333V5.83333H5.00008V15.8333Z"
                            fill="#FFF"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            <AddParticipant eventId={selectedEvent._id || ""} onParticipantAdded={handleParticipantAdded} />
          </div>
        </div>
      )}
    </div>
  );
  
};

export default EventList;
