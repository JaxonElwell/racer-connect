import { useUser } from '../context/UserContext';
import { useState, useEffect } from 'react';

function EventModal({ isOpen, onClose, event }) {
  const { user } = useUser();
  const [isRegistered, setIsRegistered] = useState(false);

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

  useEffect(() => {
    if (user && event) {
      fetch(`/api/UserEvents/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          const registered = data.events.some((e) => e.id === event.id);
          setIsRegistered(registered);
        })
        .catch((err) => console.error('Registration check failed:', err));
    }
  }, [user, event]);

  const handleAddToCalendar = async () => {
    if (!user) return alert('Login required to add events.');

    try {
      const res = await fetch('/api/UserEvents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, event_id: event.id }),
      });

      if (!res.ok) throw new Error(await res.text());

      // Call backend to create Google Calendar event
      const calendarRes = await fetch('/api/google-calendar/create-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: event.name,
          description: event.description,
          location: event.location,
          start: event.event_date,
          end: event.event_date, // Assume 1hr event or adjust if needed
        }),
      });

      if (!calendarRes.ok) throw new Error(await calendarRes.text());

      alert('Event successfully added to both calendars!');
      setIsRegistered(true);
    } catch (err) {
      console.error('Add to calendar failed:', err);
      alert('Failed to add event. Please try again.');
    }
  };

  const handleRemoveFromCalendar = async () => {
    if (!user) return alert('Login required to remove events.');

    try {
      const res = await fetch(`/api/UserEvents/${user.id}/${event.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error(await res.text());

      alert('Event removed from local calendar.');
      setIsRegistered(false);
      onClose();
    } catch (err) {
      console.error('Remove failed:', err);
      alert('Error removing event. Try again.');
    }
  };

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-60" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-2 right-2 h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          onClick={onClose}
        >
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>

        <div className="flex items-center mb-4">
          <img
            src={event.image || 'defaultEvent.jpg'}
            alt={event.name}
            className="rounded-lg w-20 h-20 mr-4"
          />
          <div>
            <h3 className="font-bold text-lg text-gray-900">{event.name}</h3>
            <p className="text-sm text-gray-700">{event.description}</p>
          </div>
        </div>

        <div className="text-sm text-gray-700 space-y-1">
          <p><strong>📅 Date:</strong> {formattedDate}</p>
          <p><strong>⏰ Time:</strong> {formattedTime}</p>
          <p><strong>📍 Location:</strong> {event.location}</p>
        </div>

        <div className="mt-4 flex justify-end">
          {isRegistered ? (
            <button
              className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition"
              onClick={handleRemoveFromCalendar}
            >
              Remove from Calendar
            </button>
          ) : (
            <button
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition"
              onClick={handleAddToCalendar}
            >
              Add to Calendar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventModal;
