import React, { useState, useEffect } from 'react';
import EventModal from './Components/EventModal';

export default function OrgModal({ isOpen, onClose, organization, user }) {
  const [isMember, setIsMember] = useState(false); // Track if the user is part of the organization
  const [recentEvent, setRecentEvent] = useState(null); // Store the most recent event
  const [isEventModalOpen, setIsEventModalOpen] = useState(false); // Control EventModal visibility
  const [selectedEvent, setSelectedEvent] = useState(null); // Store the selected event

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

  // Fetch the most recent event for the organization
  useEffect(() => {
    if (organization) {
      fetch(`/api/OrganizationEvents/${organization.id}`)
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data.events) && data.events.length > 0) {
            // Sort events by date and get the most recent one
            const sortedEvents = data.events.sort(
              (a, b) => new Date(a.event_date) - new Date(b.event_date)
            );
            setRecentEvent(sortedEvents[0]);
          }
        })
        .catch((error) => console.error('Error fetching organization events:', error));
    }
  }, [organization]);

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

  const handleEventClick = () => {
    setSelectedEvent(recentEvent); // Set the selected event
    setIsEventModalOpen(true); // Open the EventModal
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
        <div className="p-8 flex">
          {/* Left Section */}
          <div className="w-2/3 pr-4">
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

            {/* Advisor Information */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Advisor</h3>
              <p className="text-gray-700">{organization.advisor || 'Not available'}</p>
              <p className="text-gray-500">{organization.advisor_email || 'Email not available'}</p>
            </div>

            {/* Category Information */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Category</h3>
              <p className="text-gray-700">{organization.category || 'Not available'}</p>
            </div>
          </div>

          {/* Recent Event Section */}
          <div className="w-1/3 pl-4">
            <h3 className="text-lg font-semibold mb-2">Most Recent Event</h3>
            {recentEvent ? (
              <div
                className="bg-gray-100 p-4 rounded-lg shadow cursor-pointer hover:bg-gray-200 transition"
                onClick={handleEventClick} // Open EventModal on click
              >
                <h4 className="font-bold text-gray-900">{recentEvent.name}</h4>
                <p className="text-gray-700">
                  {new Date(recentEvent.event_date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-gray-700">{recentEvent.location}</p>
              </div>
            ) : (
              <p className="text-gray-500">No upcoming events</p>
            )}
          </div>
        </div>

        {/* Join/Leave Button*/}
        <div className="bg-gray-100 px-6 py-4 flex justify-end">
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

      {/* EventModal */}
      {isEventModalOpen && (
        <EventModal
          isOpen={isEventModalOpen}
          onClose={() => setIsEventModalOpen(false)}
          event={selectedEvent}
        />
      )}
    </div>
  );
}