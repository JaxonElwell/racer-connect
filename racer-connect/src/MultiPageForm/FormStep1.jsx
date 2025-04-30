import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';

function FormStep1({ onNext }) {
  const [host, setHost] = useState('');
  const [organization, setOrganization] = useState('');
  const [userOrganizations, setUserOrganizations] = useState([]);
  const { user } = useUser(); // Get the current user

  useEffect(() => {
    if (user?.email) {
      // Fetch organizations where the user is the president
      fetch('/api/StudentOrganizations')
        .then((response) => response.json())
        .then((data) => {
          const filteredOrgs = data.data.filter(
            (org) => org.president_email === user.email
          );
          setUserOrganizations(filteredOrgs);
        })
        .catch((error) =>
          console.error('Error fetching organizations:', error)
        );
    }
  }, [user]);

  const handleNext = () => {
    // Set organization_id to null if "Me" is selected
    const selectedOrganization = host === 'Me' ? null : organization;

    if (host === 'My Organization' && !organization) {
      alert('Please select an organization.');
      return;
    }

    onNext({ host, organization: selectedOrganization });
  };

  return (
    <div>
      <h2 className="text-xl text-black font-bold mb-4">
        Who is hosting this event?
      </h2>
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
          {userOrganizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
      )}
      <button
        onClick={handleNext}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Next
      </button>
    </div>
  );
}

export default FormStep1;