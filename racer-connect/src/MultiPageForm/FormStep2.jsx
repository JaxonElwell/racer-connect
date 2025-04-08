import React, { useState } from 'react';

function FormStep2({ onNext, onBack }) {
  const [eventName, setEventName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [description, setDescription] = useState('');

  const handleNext = () => {
    if (!eventName || !startDate || !startTime || !description) {
      alert('Please fill out all fields.');
      return;
    }
    onNext({ eventName, startDate, startTime, description });
  };

  return (
    <div>
      <h2 className="text-xl text-black font-bold mb-4">Event Information</h2>
      <input
        type="text"
        placeholder="Event Name"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
        className="border p-2 rounded w-full mb-4 text-black"
      />
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="border p-2 rounded w-full mb-4 text-black"
      />
      <input
        type="time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        className="border p-2 rounded w-full mb-4 text-black"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 rounded w-full mb-4 text-black"
      ></textarea>
      <div className="flex justify-between">
        <button onClick={onBack} className="bg-gray-500 text-white px-4 py-2 rounded">
          Back
        </button>
        <button onClick={handleNext} className="bg-blue-500 text-white px-4 py-2 rounded">
          Next
        </button>
      </div>
    </div>
  );
}

export default FormStep2;