import React, { useState, useEffect } from 'react';

export default function OrgModal({ isOpen, onClose, organization, user }) {
  const [isMember, setIsMember] = useState(false); // Track if the user is part of the organization

  // Check if the user is part of the organization
  useEffect(() => {
    if (user && organization) {
      fetch(`/api/UserOrganizations/${user.id}`)
        .then((response) => response.json())
        .then((data) => {
          const member = data.organizations.some((org) => org.id === organization.id);
          setIsMember(member);
        })
        .catch((error) => console.error('Error checking membership:', error));
    }
  }, [user, organization]);

  const handleJoinOrganization = async () => {
    if (!user) {
      alert('You must be logged in to join an organization.');
      return;
    }

    try {
      const response = await fetch('/api/UserOrganizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          organization_id: organization.id,
        }),
      });

      if (response.ok) {
        alert('You have successfully joined the organization!');
        setIsMember(true); // Update the state to reflect the membership
      } else {
        const error = await response.text();
        console.error('Error joining organization:', error);
        alert('Failed to join the organization. Please try again.');
      }
    } catch (error) {
      console.error('Error joining organization:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleLeaveOrganization = async () => {
    if (!user) {
      alert('You must be logged in to leave an organization.');
      return;
    }

    try {
      const response = await fetch('/api/UserOrganizations', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          organization_id: organization.id,
        }),
      });

      if (response.ok) {
        alert('You have successfully left the organization!');
        setIsMember(false); // Update the state to reflect the removal
      } else {
        const error = await response.text();
        console.error('Error leaving organization:', error);
        alert('Failed to leave the organization. Please try again.');
      }
    } catch (error) {
      console.error('Error leaving organization:', error);
      alert('An error occurred. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black opacity-60" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl h-auto max-h-[90vh] overflow-y-auto relative text-black z-10">
        {/* Blue Banner */}
        <div className="bg-blue-600 text-white px-6 py-3 rounded-t-lg flex justify-between items-center">
          <h2 className="text-xl font-bold">{organization.name}</h2>
          <button className="text-white text-2xl hover:text-gray-300" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8">
          {organization.image && (
            <img
              src={organization.image}
              alt={organization.name}
              className="mb-4 w-full h-auto rounded-lg"
            />
          )}
          <p className="mb-4">{organization.description}</p>

          {/* President Information */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold">President</h3>
            <p className="text-gray-700">{organization.president || 'Not available'}</p>
            <p className="text-gray-500">{organization.president_email || 'Email not available'}</p>
          </div>

          {/* Join/Leave Button */}
          <div className="mt-4 flex justify-end">
            {isMember ? (
              <button
                className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition duration-300"
                onClick={handleLeaveOrganization}
              >
                Leave Organization
              </button>
            ) : (
              <button
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                onClick={handleJoinOrganization}
              >
                Join Organization
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}