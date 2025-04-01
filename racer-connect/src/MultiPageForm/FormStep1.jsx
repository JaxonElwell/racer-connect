import React, { useState } from 'react';

function FormStep1({ onNext }) {
  const [host, setHost] = useState('');
  const [organization, setOrganization] = useState('');

  const handleNext = () => {
    if (host === 'My Organization' && !organization) {
      alert('Please select an organization.');
      return;
    }
    onNext({ host, organization });
  };

  return (
    <div>
      <h2 className="text-xl text-black font-bold mb-4">Who is hosting this event?</h2>
      <select
        value={host}
        onChange={(e) => setHost(e.target.value)}
        className="border p-2 rounded w-full mb-4 text-black"
      >
        <option value="">Select an option</option>
        <option value="Me">Me</option>
        <option value="My Organization">My Organization</option>
      </select>
      {host === 'My Organization' && (
        <select
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          className="border p-2 rounded w-full mb-4 text-black"
        >
          <option value="">Select your organization</option>
          {/* Replace the options below with dynamic data from the database */}
          <option value="Org1">Organization 1</option>
          <option value="Org2">Organization 2</option>
        </select>
      )}
      <button onClick={handleNext} className="bg-blue-500 text-white px-4 py-2 rounded">
        Next
      </button>
    </div>
  );
}

export default FormStep1;