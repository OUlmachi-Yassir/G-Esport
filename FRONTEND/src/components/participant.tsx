import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
}

interface AddParticipantProps {
    eventId: string;
    onParticipantAdded: () => void;  
  }
  
  const AddParticipant: React.FC<AddParticipantProps> = ({ eventId, onParticipantAdded }) => {
    const [participants, setParticipants] = useState<User[]>([]);
    const [selectedParticipantId, setSelectedParticipantId] = useState<string>('');
    const [message, setMessage] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchParticipants = async () => {
        try {
          const response = await axios.get('http://localhost:3000/api/users/participant');
          setParticipants(response.data);
        } catch (error) {
          console.error('Error fetching participants', error);
        }
      };
  
      fetchParticipants();
    }, []);
  
    const handleAddParticipant = async () => {
      if (!selectedParticipantId) {
        setMessage('Please select a participant.');
        return;
      }
  
      try {
        const response = await axios.post('http://localhost:3000/api/events/addParticipant', {
          eventId,
          participantId: selectedParticipantId,
        });
  
        setMessage(response.data.message);
        setSelectedParticipantId('');
        
        onParticipantAdded();
      } catch (error) {
        console.error('Error adding participant', error);
        setMessage('Error adding participant to the event.');
      }
    };
  
    return (
      <div className="mt-6">
        <label htmlFor="participantSelect" className="block text-sm font-medium text-gray-700 mb-2">
          Select Participant
        </label>
        <select
          id="participantSelect"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={selectedParticipantId}
          onChange={(e) => setSelectedParticipantId(e.target.value)}
        >
          <option value="">-- Select a participant --</option>
          {participants.map((participant) => (
            <option key={participant._id} value={participant._id}>
              {participant.name}
            </option>
          ))}
        </select>
  
        <button
          onClick={handleAddParticipant}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all"
        >
          Add Participant
        </button>
  
        {message && (
          <div className="mt-4 p-2 bg-blue-100 text-blue-800 rounded-md">
            {message}
          </div>
        )}
      </div>
    );
  };
  

export default AddParticipant;
