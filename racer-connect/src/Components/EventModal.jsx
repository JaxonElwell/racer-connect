import { useUser } from '../context/UserContext';
import { useState, useEffect } from 'react';

function EventModal({ isOpen, onClose, event }) {
  const { user } = useUser(); // Get the current user from context
  const [isRegistered, setIsRegistered] = useState(false); // Track if the user is registered for the event

  // Format the event date and time
  const formattedDate = event
    ? new Date(event.event_date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const formattedTime = event
    ? new Date(event.event_date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : '';

  // Check if the user is registered for the event
  useEffect(() => {
    if (user && event) {
      fetch(`/api/UserEvents/${user.id}`)
        .then((response) => response.json())
        .then((data) => {
          const registered = data.events.some((e) => e.id === event.id);
          setIsRegistered(registered);
        })
        .catch((error) => console.error('Error checking registration:', error));
    }
  }, [user, event]);

  const handleAddToCalendar = async () => {
    if (!user) {
      alert('You must be logged in to add events to your calendar.');
      return;
    }

    try {
      const response = await fetch('/api/UserEvents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id, // Pass the current user's ID
          event_id: event.id, // Pass the event ID
        }),
      });

      if (response.ok) {
        alert('Event added to your calendar successfully!');
        setIsRegistered(true); // Update the state to reflect the registration
      } else {
        const error = await response.text();
        console.error('Error adding event to calendar:', error);
        alert('Failed to add event to calendar. Please try again.');
      }
    } catch (error) {
      console.error('Error adding event to calendar:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleRemoveFromCalendar = async () => {
    if (!user) {
      alert('You must be logged in to remove events from your calendar.');
      return;
    }

    try {
      const response = await fetch(`/api/UserEvents/${user.id}/${event.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Event removed from your calendar successfully!');
        setIsRegistered(false); // Update the state to reflect the removal
        onClose(); // Close the modal
      } else {
        const error = await response.text();
        console.error('Error removing event from calendar:', error);
        alert('Failed to remove event from calendar. Please try again.');
      }
    } catch (error) {
      console.error('Error removing event from calendar:', error);
      alert('An error occurred. Please try again.');
    }
  };

  // Render the modal only if `isOpen` is true
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-black opacity-60"
        onClick={onClose} // Close the modal when clicking outside
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-10">
        {/* Close Icon (X) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-2 right-2 h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer transition duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          onClick={onClose}
          aria-label="Close"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>

        {event && (
          <>
            <div className="flex items-center mb-4">
              <img
                src={event.image || 'defaultEvent.jpg'} // Use the image URL or fallback to default
                alt={event.name}
                className="rounded-lg w-20 h-20 mr-4"
              />
              <div>
                <h3 className="font-bold text-lg text-gray-900">{event.name}</h3>
                <p className="text-sm text-gray-700">{event.description}</p>
              </div>
            </div>
            <div className="text-sm text-gray-700">
              <p>
                <strong>📅 Date:</strong> {formattedDate}
              </p>
              <p>
                <strong>⏰ Time:</strong> {formattedTime}
              </p>
              <p>
                <strong>📍 Location:</strong> {event.location}
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              {isRegistered ? (
                <button
                  className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition duration-300"
                  onClick={handleRemoveFromCalendar}
                >
                  Remove from Calendar
                </button>
              ) : (
                <button
                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                  onClick={handleAddToCalendar}
                >
                  Add to Calendar
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default EventModal;
