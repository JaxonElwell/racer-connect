import React, { useState, useEffect, useRef } from 'react';
import Layout from './Layout';
import EventModal from './Components/EventModal';

function EventsPage() {
  const [events, setEvents] = useState([]); // Loaded events
  const [currentPage, setCurrentPage] = useState(0); // Tracks the current page
  const [currentSearch, setCurrentSearch] = useState(''); // Tracks the current search
  const [isLoading, setIsLoading] = useState(false); // Loading state for fetching data
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
  const [selectedEvent, setSelectedEvent] = useState(null); // Selected event for the modal
  const [showPastEvents, setShowPastEvents] = useState(false); // Toggle for showing past events

  const hasFetched = useRef(false); // Prevent double-fetch in Strict Mode

  const fetchEvents = async (page, search) => {
    setIsLoading(true);
    try {
      console.log(`Fetching page: ${page}`); // Debugging
      if(!search) { // Set Search
        search = '%';
      } else {
        search = '%' + search + '%';
      }
      const response = await fetch(`http://localhost:5000/api/EventsPaginated?page=${page}&limit=10&search=${search}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched data:', data.data); // Debugging
      if (Array.isArray(data.data)) {
        setEvents((prev) => [...prev, ...data.data]); // Append new events to the list
      } else {
        console.error('Unexpected response format:', data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchEvents(nextPage);
  };

  const handleOpenModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(false);
  };

  const handleSearch = () => {
    setEvents([]);
    setCurrentPage(0);
    fetchEvents(currentPage, currentSearch);
  }

  useEffect(() => {
    if (!hasFetched.current) {
      console.log('Fetching initial events');
      fetchEvents(0);
      hasFetched.current = true;
    }
  }, []);

  // Filter events based on the toggle
  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.event_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate comparison
    return showPastEvents || eventDate >= today; // Show all events if toggle is on, otherwise only future events
  });

  return (
    <Layout>
      <div className="px-4 sm:px-8">
        <h1 className="text-3xl font-bold text-center mb-8">Events</h1>

        {/* Search Bar Placeholder */}
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            value={currentSearch}
            onChange={(e) => {setCurrentSearch(e.target.value)}}
            placeholder="Search events..."
            className="border bg-white border-gray-300 rounded-lg p-2 w-full max-w-md text-black"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white font-bold py-2 px-6 rounded hover:bg-blue-600 transition duration-300"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Search'}
          </button>
        </div>

        {/* Toggle for Past Events */}
        <div className="mb-6 flex justify-center items-center">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showPastEvents}
              onChange={(e) => setShowPastEvents(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="text-white">Show Past Events</span>
          </label>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-gray-100 rounded-lg p-4 flex flex-col items-center cursor-pointer hover:bg-gray-200 transition hover:scale-105"
              onClick={() => handleOpenModal(event)}
            >
              <img
                src={event.image || 'defaultEvent.jpg'}
                alt={event.name}
                className="rounded-lg w-20 h-20 mb-4"
              />
              <h3 className="font-bold text-lg text-gray-900 text-center">{event.name}</h3>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            className="bg-blue-500 text-white font-bold py-2 px-6 rounded hover:bg-blue-600 transition duration-300"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Load More Events'}
          </button>
        </div>

        {/* EventModal */}
        {isModalOpen && (
          <EventModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            event={selectedEvent}
          />
        )}
      </div>
    </Layout>
  );
}

export default EventsPage;