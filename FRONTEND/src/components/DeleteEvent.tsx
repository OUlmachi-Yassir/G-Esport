import React from 'react';

interface DeleteEventProps {
  eventId: string;
  onBack: () => void;
}

const DeleteEvent: React.FC<DeleteEventProps> = ({ eventId, onBack }) => {
  const handleDelete = () => {
    fetch(`http://localhost:3000/api/events/${eventId}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        onBack();
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <h2>Are you sure you want to delete this event?</h2>
      <button onClick={handleDelete}>Yes</button>
      <button onClick={onBack}>No</button>
    </div>
  );
};

export default DeleteEvent;
