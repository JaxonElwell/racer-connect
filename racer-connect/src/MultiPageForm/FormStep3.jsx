import React, { useState } from 'react';

function FormStep3({ onNext, onBack }) {
  const [inviteType, setInviteType] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleNext = () => {
    if (!inviteType) {
      alert('Please select who is invited.');
      return;
    }

    onNext({ inviteType, image: imageUrl });
  };

  return (
    <div>
      <h2 className="text-xl text-black font-bold mb-4">Finalize Your Event</h2>

      <label className="block mb-2 text-sm font-medium text-gray-700">
        Who is invited?
      </label>
      <select
        value={inviteType}
        onChange={(e) => setInviteType(e.target.value)}
        className="border p-2 rounded w-full mb-4 text-black"
      >
        <option value="">Select an option</option>
        <option value="public">Public</option>
        <option value="private">Private</option>
      </select>

      <label className="block mb-2 text-sm font-medium text-gray-700">
        Image URL
      </label>
      <input
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Enter the image URL"
        className="border p-2 rounded w-full mb-4 text-black"
      />

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-600 transition duration-300"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default FormStep3;
