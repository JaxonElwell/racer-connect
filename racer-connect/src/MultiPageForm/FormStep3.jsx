import React, { useState } from 'react';

function FormStep3({ onSubmit, onBack }) {
  const [inviteType, setInviteType] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = () => {
    if (!inviteType) {
      alert('Please select who is invited.');
      return;
    }
    onSubmit({ inviteType, image });
  };

  return (
    <div>
      <h2 className="text-xl text-black font-bold mb-4">Settings</h2>
      <select
        value={inviteType}
        onChange={(e) => setInviteType(e.target.value)}
        className="border p-2 rounded w-full mb-4 text-black"
      >
        <option value="">Who is invited?</option>
        <option value="Anyone">Anyone</option>
        <option value="My Organization Only">My Organization Only</option>
      </select>
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        className="border p-2 rounded w-full mb-4 text-black"
      />
      <div className="flex justify-between">
        <button onClick={onBack} className="bg-gray-500 text-white px-4 py-2 rounded">
          Back
        </button>
        <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </div>
    </div>
  );
}

export default FormStep3;