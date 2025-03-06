import React, { useState } from 'react';
import Layout from './Layout';
import OrgModal from './OrgModal';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState(null);

  const testOrganization = {
    name: 'Test Organization',
    description: 'This is a test organization for demonstration purposes.',
    image: 'testOrgImage.jpg', // Replace with the actual image path if available
    miscInfo: 'Additional information about the test organization.',
  };

  const handleOpenModal = () => {
    setSelectedOrganization(testOrganization);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrganization(null);
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-center">Welcome to Racer Connect</h1>
      
      {/* Buttons Section */}
      <div className="mt-4 flex justify-center items-center w-full px-8">
        <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-4xl">
          <div className="flex justify-between space-x-4">
            <button className="bg-yellow-500 text-black font-bold py-2 px-6 rounded hover:bg-yellow-600 transition duration-300 w-full">
              Organize an event
            </button>
            <button className="bg-yellow-500 text-black font-bold py-2 px-6 rounded hover:bg-yellow-600 transition duration-300 w-full">
              Find events
            </button>
            <button className="bg-yellow-500 text-black font-bold py-2 px-6 rounded hover:bg-yellow-600 transition duration-300 w-full">
              Find organizations
            </button>
            <button
              className="bg-yellow-500 text-black font-bold py-2 px-6 rounded hover:bg-yellow-600 transition duration-300 w-full"
              onClick={handleOpenModal}
            >
              Test Open Organization Page
            </button>
          </div>
        </div>
      </div>

      {/* My Events Section */}
      <div className="mt-8 px-8">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">My Events</h2>
            <a href="#" className="text-gray-600 hover:underline">See All</a>
          </div>

          {/* Events Container */}
          <div className="grid grid-cols-2 gap-4">
            {/* Event Card 1 */}
            {/* this is all placeholder until we get the database up and running */}
            <div className="bg-gray-100 rounded-lg p-4 flex items-center">
              <img 
                src="bgClub.jpg" 
                alt="Event Thumbnail" 
                className="rounded-lg w-20 h-20 mr-4"
              />
              <div>
                <h3 className="font-bold text-lg  text-gray-900">Field Games and Giant Games</h3>
                <p className="text-sm text-gray-700">Board Game Club</p>
                <p className="text-sm text-gray-700"><strong>📅 September 18</strong></p>
                <p className="text-sm text-gray-700"><strong>📍 Waterfield Breezeway</strong></p>
              </div>
            </div>

            {/* Event Card 2 */}
            <div className="bg-gray-100 rounded-lg p-4 flex items-center">
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

      {/* Organization Modal */}
      <OrgModal isOpen={isModalOpen} onClose={handleCloseModal} organization={selectedOrganization} />
    </Layout>
  );
}

export default App;