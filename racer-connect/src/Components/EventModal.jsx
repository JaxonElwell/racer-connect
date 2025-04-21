function EventModal({ isOpen, onClose, event }) {
  if (!isOpen || !event) return null;

  const formattedDate = new Date(event.event_date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = new Date(event.event_date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

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
          {/* Dummy Add to Calendar Button */}
          <button
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            onClick={() => console.log('Add to calendar clicked!')}
          >
            Add to Calendar
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventModal;