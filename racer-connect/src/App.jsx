import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import OrgModal from './OrgModal';
import Form from './MultiPageForm/Form';
import { useNavigate } from 'react-router-dom';
import SkeletonEventCard from './Components/SkeletonEventCard';
import EventModal from './Components/EventModal';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null); // State for the selected event
  const [organizations, setOrganizations] = useState([]);
  const [events, setEvents] = useState([]); // Ensure initial state is an array
  const [error, setError] = useState(null);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true); // Loading state for events
  const navigate = useNavigate();
  
  const goToStudentInfo = () => {
    navigate('/StudentInfo'); 
  };
  
  const goToOrganizationsPage = () => {
    navigate('/OrganizationsPage');
  };
  
  useEffect(() => {
    // Fetch all organizations when the component mounts
    fetch('/api/StudentOrganizations')
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          setOrganizations(data.data); // Access the `data` property
        } else {
          console.error('Expected an array but got:', data);
          setOrganizations([]); // Fallback to an empty array
        }
      })
      .catch((error) => console.error('Error fetching organizations:', error));
  
    // Fetch all events
    fetch('/api/Events')
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          setEvents(data.data); // Access the `data` property
        } else {
          console.error('Expected an array but got:', data);
          setEvents([]); // Fallback to an empty array
        }
      })
      .catch((error) => console.error('Error fetching events:', error))
      .finally(() => setIsLoadingEvents(false)); // Set loading to false
  }, []);

  const handleOpenEventModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseEventModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(false);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-center">Welcome to Racer Connect</h1>
      
      {/* Buttons Section */}
      <div className="mt-4 flex justify-center items-center w-full px-4 sm:px-8">
        <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-7xl">
          <div className="flex justify-between space-x-4 w-full">
            <button
              className="bg-yellow-500 text-black font-bold py-2 px-6 rounded hover:bg-yellow-600 transition duration-300 w-1/3"
              onClick={() => setIsFormOpen(true)}
            >
              Organize an event
            </button>
            <button className="bg-yellow-500 text-black font-bold py-2 px-6 rounded hover:bg-yellow-600 transition duration-300 w-1/3">
              Find events
            </button>
            <button className="bg-yellow-500 text-black font-bold py-2 px-6 rounded hover:bg-yellow-600 transition duration-300 w-1/3"
              onClick={goToOrganizationsPage}>
              Find organizations
            </button>
          </div>
        </div>
      </div>

      {/* Featured Events Section */}
      <div className="mt-8 px-4 sm:px-8 flex justify-center w-full">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-7xl">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Featured Events</h2>
          <div className="grid grid-cols-2 gap-4">
            {isLoadingEvents || events.length === 0
              ? [1, 2].map((key) => <SkeletonEventCard key={key} />) // Show skeletons while loading or if no events
              : events.slice(0, 2).map((event) => ( // Show events if available
                  <div
                    key={event.id}
                    className="bg-gray-100 rounded-lg p-4 flex items-center transform transition-transform duration-300 hover:scale-105 cursor-pointer"
                    onClick={() => handleOpenEventModal(event)} // Open modal on click
                  >
                    <img
                      src={event.image || 'defaultEvent.jpg'}
                      alt={event.name}
                      className="rounded-lg w-20 h-20 mr-4"
                    />
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{event.name}</h3>
                      <p className="text-sm text-gray-700">{event.description}</p>
                      <p className="text-sm text-gray-700"><strong>📅 {event.event_date}</strong></p>
                      <p className="text-sm text-gray-700"><strong>📍 {event.location}</strong></p>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>

      {/* My Events Section */}
      <div className="mt-8 px-4 sm:px-8 flex justify-center w-full">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-7xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">My Events</h2>
            <a href="#" className="text-gray-600 hover:underline">See All</a>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 rounded-lg p-4 flex items-center transform transition-transform duration-300 hover:scale-105">
              <img 
                src="bgClub.jpg" 
                alt="Event Thumbnail" 
                className="rounded-lg w-20 h-20 mr-4"
              />
              <div>
                <h3 className="font-bold text-lg text-gray-900">Field Games and Giant Games</h3>
                <p className="text-sm text-gray-700">Board Game Club</p>
                <p className="text-sm text-gray-700"><strong>📅 September 18</strong></p>
                <p className="text-sm text-gray-700"><strong>📍 Waterfield Breezeway</strong></p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 flex items-center transform transition-transform duration-300 hover:scale-105">
              <img 
                src="CASzBci.jpeg" 
                alt="Event Thumbnail" 
                className="rounded-lg w-20 h-20 mr-4"
              />
              <div>
                <h3 className="font-bold text-lg text-gray-900">Best in the West #4</h3>
                <p className="text-sm text-gray-700">Murray State Tournaments & Local Events</p>
                <p className="text-sm text-gray-700"><strong>📅 January 26</strong></p>
                <p className="text-sm text-gray-700"><strong>📍 Clark South Commons</strong></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseEventModal}
        event={selectedEvent}
      />

      {/* Organizations Section */}
      <div className="mt-8 px-4 sm:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Student Organizations</h2>
            <a href="#" className="text-gray-600 hover:underline">See All</a>
          </div>

          {/* Organizations Container */}
          <div className="flex flex-col gap-4">
            {organizations.length > 0 ? (
              organizations.slice(0, 7).map((org) => (
                <div 
                  key={org.id} 
                  className="bg-gray-100 rounded-lg p-4 flex items-center cursor-pointer hover:bg-gray-200 transition hover:scale-105"
                  onClick={() => handleOpenModal(org.id)}
                >
                  <img 
                    src={org.image || "defaultOrg.jpg"} 
                    alt={org.name} 
                    className="rounded-lg w-20 h-20 mr-4"
                  />
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{org.name}</h3>
                    <p className="text-sm text-gray-700">{org.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-700">No organizations found.</p>
            )}

            {/* Dummy Organization */}
            <div 
              className="bg-gray-100 rounded-lg p-4 flex items-center cursor-pointer hover:bg-gray-200 transition"
              onClick={() => handleOpenModal(1)} // Hardcoded ID for testing
            >
              <img 
                src="defaultOrg.jpg" 
                alt="Dummy Organization" 
                className="rounded-lg w-20 h-20 mr-4"
              />
              <div>
                <h3 className="font-bold text-lg text-gray-900">Dummy Organization</h3>
                <p className="text-sm text-gray-700">This is a dummy organization for testing purposes.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Page Form */}
      {isFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Background Overlay */}
          <div
            className="absolute inset-0 bg-black opacity-60"
            onClick={handleCloseForm} // Close the form when clicking outside
          ></div>

          {/* Form Container */}
          <div className="relative bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl z-10">
            <Form onClose={handleCloseForm} />
          </div>
        </div>
      )}
    </Layout>
  );
}

export default App;