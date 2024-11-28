import React, { useState } from 'react';
import EventList from '../components/EventList';
import AddEventForm from '../components/AddEvent';

const Dashboard: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  const handleCreateNew = () => {
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleCreateNew}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Event
        </button>
      </div>
      <EventList />
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
            <AddEventForm onClose={closeForm} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
