import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import OrgModal from './OrgModal';
import Form from './MultiPageForm/Form';
import { useNavigate } from 'react-router-dom';
import SkeletonEventCard from './Components/SkeletonEventCard';
import EventModal from './Components/EventModal';
import { useUser } from './context/UserContext';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null); // State for the selected event
  const [organizations, setOrganizations] = useState([]);
  const [events, setEvents] = useState([]); // Ensure initial state is an array
  const [userEvents, setUserEvents] = useState([]); // State for user's registered events
  const [isLoadingEvents, setIsLoadingEvents] = useState(true); // Loading state for events
  const [isLoadingUserEvents, setIsLoadingUserEvents] = useState(true); // Loading state for user events
  const { user } = useUser(); // Get the current user
  const navigate = useNavigate();

  const goToStudentInfo = () => {
    navigate('/StudentInfo');
  };

  const goToOrganizationsPage = () => {
    navigate('/OrganizationsPage');
  };

  const goToEventsPage = () => {
    navigate('/EventsPage'); // Navigate to the EventsPage
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

  useEffect(() => {
    if (user?.id) {
      // Fetch user's registered events
      fetch(`/api/UserEvents/${user.id}`)
        .then((response) => response.json())
        .then((data) => {
          setUserEvents(data.events || []);
        })
        .catch((error) => console.error('Error fetching user events:', error))
        .finally(() => setIsLoadingUserEvents(false));
    }
  }, [user]);

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

  // Helper function to filter events that occur today or in the future
  const filterFutureEvents = (events) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate comparison
    return events.filter((event) => {
      const eventDate = new Date(event.event_date);
      return eventDate >= today; // Include only events today or in the future
    });
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
              onClick={() => {
                console.log('Opening form...');
                setIsFormOpen(true);
              }}
            >
              Organize an event
            </button>
            <button
              className="bg-yellow-500 text-black font-bold py-2 px-6 rounded hover:bg-yellow-600 transition duration-300 w-1/3"
              onClick={goToEventsPage} // Navigate to EventsPage
            >
              Find events
            </button>
            <button
              className="bg-yellow-500 text-black font-bold py-2 px-6 rounded hover:bg-yellow-600 transition duration-300 w-1/3"
              onClick={goToOrganizationsPage}
            >
              Find organizations
            </button>
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

      {/* Featured Events Section */}
      <div className="mt-8 px-4 sm:px-8 flex justify-center w-full">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-7xl">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Featured Events</h2>
          <div className="grid grid-cols-2 gap-4">
            {isLoadingEvents ? (
              // Show skeletons while loading
              [1, 2].map((key) => <SkeletonEventCard key={key} />)
            ) : (
              filterFutureEvents(events).slice(0, 2).map((event) => (
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
                    <p className="text-sm text-gray-700">
                      <strong>📅 {new Date(event.event_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}</strong>
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>📍 {event.location}</strong>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* My Events Section */}
      <div className="mt-8 px-4 sm:px-8 flex justify-center w-full">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-7xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">My Events</h2>
<<<<<<< HEAD
            <a href="#" className="text-gray-600 hover:underline"
              onClick={(e) => {
                e.preventDefault(); // Prevent default anchor behavior
                goToStudentInfo(); // Navigate to StudentInfo page
              }}>
=======
            <a
              href="#"
              className="text-gray-600 hover:underline"
              onClick={(e) => {
                e.preventDefault(); // Prevent default anchor behavior
                goToStudentInfo(); // Navigate to StudentInfo page
              }}
            >
>>>>>>> f6c23465807840dc68b2a529021142aa8a63f0e4
              See All
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {isLoadingUserEvents ? (
              // Show skeletons while loading
              [1, 2].map((key) => <SkeletonEventCard key={key} />)
            ) : (
              filterFutureEvents(userEvents).map((event) => (
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
                    <p className="text-sm text-gray-700">
                      <strong>📅 {new Date(event.event_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}</strong>
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>📍 {event.location}</strong>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseEventModal}
        event={selectedEvent}
      />
    </Layout>
  );
}

export default App;