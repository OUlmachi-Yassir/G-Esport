import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice'; 
import { useNavigate } from 'react-router-dom';
import EventList from '../components/EventList';
import AddEventForm from '../components/AddEvent';

const Dashboard: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout()); 
    navigate('/login'); 
  };

  const handleCreateNew = () => {
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>

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
