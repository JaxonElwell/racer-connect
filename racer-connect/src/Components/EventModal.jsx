import React from 'react';

function EventModal({ isOpen, onClose, event }) {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-black opacity-60"
        onClick={onClose} // Close the modal when clicking outside
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-10">
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
        <div className="text-sm text-gray-700">
          <p><strong>📅 Date:</strong> {event.event_date}</p>
          <p><strong>📍 Location:</strong> {event.location}</p>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition duration-300"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventModal;